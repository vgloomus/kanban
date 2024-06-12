module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    // 规定每个文件的import引入 防止位置和顺序
    "import",
  ],
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    // "react-hooks/exhaustive-deps": "warn",
    // // 自定义规则，检查代码中是否使用了未导入的 React Hooks
    // "custom/react-hooks-imported": [
    //   "error",
    //   {
    //     hooks: [
    //       "useState",
    //       "useEffect",
    //       "useContext",
    //       "useReducer",
    //       "useCallback",
    //       "useMemo",
    //       "useRef",
    //       "useImperativeHandle",
    //       "useLayoutEffect",
    //       "useDebugValue",
    //     ],
    //     fixable: "code",
    //   },
    // ],
    // 具体防止顺序
    // "import/order": [
    //   "error",
    //   {
    //     groups: [
    //       "builtin",
    //       "external",
    //       ["internal", "parent", "sibling", "index"],
    //       "unknown",
    //     ],
    //     pathGroups: [
    //       // react*相关的设置before，意思是放在builtin之前
    //       {
    //         pattern: "react*",
    //         group: "builtin",
    //         position: "before",
    //       }, // ts 别名@/设置after，意思是放在external之后

    //       {
    //         pattern: "@/**",
    //         group: "external",
    //         position: "after",
    //       },
    //     ],
    //     "newlines-between": "always",
    //   },
    // ],
  },
};
