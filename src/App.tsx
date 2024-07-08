/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";

import "./App.scss";
import logo from "./logo.svg";
import KanBanBoard, {
  COLUMN_KEY_TODO,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_DONE,
} from "./KanBanBoard.tsx";
import AdminContext from "./context/AdminContext.tsx";
interface Card {
  title: string;
  status: string;
  onDragStart?: any;
}

const DATA_STORE_KEY = "kanban-data-store";

const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Card[]>([
    { title: "开发任务-1", status: "2024-06-22 17:15" },
    { title: "开发任务-3", status: "2023-05-22 18:15" },
    { title: "开发任务-5", status: "2022-05-12 18:15" },
    { title: "测试任务-3", status: "2022-05-24 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState<Card[]>([
    { title: "开发任务-4", status: "2022-05-22 18:15" },
    { title: "开发任务-6", status: "2022-05-22 18:15" },
    { title: "测试任务-2", status: "2022-05-22 18:15" },
  ]);
  const [doneList, setDoneList] = useState<Card[]>([
    { title: "开发任务-2", status: "2022-05-22 18:15" },
    { title: "测试任务-1", status: "2022-05-22 18:15" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const updaters = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  // 读取远程数据，使用浏览器内置的 `localStorage` 本地存储API代替远程服务
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    // 模拟请求耗时，增加1秒定时器
    setTimeout(() => {
      if (data) {
        const KanBanColumnData = JSON.parse(data);
        setTodoList(KanBanColumnData.todoList);
        setOngoingList(KanBanColumnData.ongoingList);
        setDoneList(KanBanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  function handleAdd(column, newCard) {
    updaters[column]((currentStat) => [newCard, ...currentStat]);
  }

  function handleRemove(column, cardToRemove) {
    updaters[column]((currentStat) =>
      currentStat.filter((item) => item.title !== cardToRemove.title),
    );
  }

  // 新增管理员模式
  const [isAdmin, setIsAdmin] = useState(false);
  function handleToggleAdmin(evt) {
    setIsAdmin(!isAdmin);
  }
  // 实际业务中，涉及到本地数据与远程数据的同步，逻辑非常复杂；这里偷懒，增加一个保存所有卡片的按钮，由用户决定什么时候存储
  function handleSaveAll() {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板 <button onClick={handleSaveAll}>保存所有卡片</button>
          <label>
            <input
              type="checkbox"
              value="isAdmin"
              checked={isAdmin}
              onChange={handleToggleAdmin}
            />
            管理员模式
          </label>
        </h1>

        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanBanBoard
          isLoading={isLoading}
          todoList={todoList}
          ongoingList={ongoingList}
          doneList={doneList}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </AdminContext.Provider>
    </div>
  );
};

export default App;
