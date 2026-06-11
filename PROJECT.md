### glimmer Blog（个人品牌博客站）

#### 项目描述
基于 Vue 3 + Supabase 构建的个人博客与作品集站点，采用全栈玻璃拟态（Glassmorphism）设计语言，配合 Vanta.js 3D 动态波浪背景与滚动驱动的视差动画，实现沉浸式浏览体验。前端直接通过 supabase-js 调用 Supabase PostgreSQL 作为后端服务，无需自建 Node 服务器。

#### 技术栈
- Vue 3（Composition API + script setup）
- TypeScript
- Vite
- Supabase（BaaS 替代后端）
- Vanta.js + Three.js（3D 背景）
- SCSS（玻璃拟态混入库）
- Tailwind CSS
- Vue Router（Hash 模式）

#### 难点与解决方案

##### 零后端架构设计
传统博客需要 Node.js + MongoDB 或类似方案，本项目选择 Supabase 作为后端服务，前端通过 `@supabase/supabase-js` 直接操作 PostgreSQL。通过 `src/api/` 层统一封装所有数据库请求，组件只需调用 `getAllContent()` 一行即可获取数据，与真实后端的调用体验无异。

##### 滚动驱动的多重视差效果
首页需要 Hero 渐隐、背景模糊叠加层、装饰画框平移、内容区淡入等多层动画协同。使用模块级 `useScrollState` composable 将滚动进度 `(0-1)` 暴露为单例响应式状态，`App.vue` 与 `home.vue` 共享该状态，分别驱动 Vanta 背景透明度/模糊度与页面元素的逐帧变换，保证多层动画的同步与流畅。

##### 玻璃拟态设计体系的一致性
全站 5 个页面 + 4 个组件共享同一套玻璃拟态视觉风格，但 Vue SFC 的 scoped 样式天然隔离。将 `glass-card`、`glass-card-title`、`page-layout` 等复用规则抽取为 SCSS 混入（`src/styles/glass.scss`），所有视图统一 `@use` 引用，一处修改全局生效，避免样式碎片化。

##### 从 MongoDB Schema 到 Supabase 的数据迁移
原有后端设计使用 MongoDB（无 Schema 约束 + 嵌套文档），迁移到 Supabase PostgreSQL 时需要重新设计表结构与字段类型。通过在 `supabase-migration.sql` 中建立带约束的 CREATE TABLE 语句，配合 `ON CONFLICT DO NOTHING` 幂等插入，同时为所有表添加 RLS 策略允许匿名 SELECT，保证迁移脚本可反复安全执行。

##### Vanta.js 与 Vue 生命周期的整合
Vanta.js 基于 Three.js 的 imperative API（非声明式），需要手动管理实例的创建与销毁。在 `VantaBackground.vue` 的 `onMounted` 中初始化 `VANTA.WAVES()`，在 `onUnmounted` 中调用 `destroy()`，并通过 props 接收父组件的 `opacity` 与 `blur` 响应式参数实现同步，解决声明式框架与命令式库的集成问题。

##### 卡片封面图与色彩兜底方案
`content` 表中的每条记录可能包含图片链接（`img`）或纯色标识（`cover_color`），两者不一定同时存在。通过 `coverStyle()` 函数判断 `item.img` 是否为空，非空则显示背景图，否则回退为 `cover_color` 的渐变背景，保证封面区域始终有视觉内容。
