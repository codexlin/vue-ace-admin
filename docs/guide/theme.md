# 主题定制

## CSS 变量

组件库使用 CSS 变量来实现主题定制，你可以通过覆盖这些变量来定制主题。

```css
:root {
  --ace-primary-color: #1890ff;
  --ace-success-color: #52c41a;
  --ace-warning-color: #faad14;
  --ace-error-color: #f5222d;
  --ace-text-color: #262626;
  --ace-text-color-secondary: #8c8c8c;
  --ace-border-color: #d9d9d9;
  --ace-border-radius: 6px;
}
```

## 主题配置

### 主色调定制

```css
:root {
  --ace-primary-color: #722ed1;
}
```

### 圆角定制

```css
:root {
  --ace-border-radius: 8px;
}
```

## 暗色主题

```css
[data-theme="dark"] {
  --ace-primary-color: #177ddc;
  --ace-text-color: #ffffff;
  --ace-text-color-secondary: #a6a6a6;
  --ace-border-color: #424242;
}
```

## 自定义组件样式

```vue
<style>
.my-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
}
</style>
```
