import React, { useState } from "react";

import "./App.css";
import logo from "./logo.svg";

interface Card {
  title: string;
  status: string;
}

interface KanbanNewCardProps {
  onSubmit: (title: string) => void;
}

const KanbanCard: React.FC<Card> = ({ title, status }) => {
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
    </li>
  );
};

const KanbanNewCard: React.FC<KanbanNewCardProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit(title);
    }
  };

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </li>
  );
};

const App: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState<Card[]>([
    { title: "开发任务-1", status: "22-05-22 18:15" },
    { title: "开发任务-3", status: "22-05-22 18:15" },
    { title: "开发任务-5", status: "22-05-22 18:15" },
    { title: "测试任务-3", status: "22-05-22 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState<Card[]>([
    { title: "开发任务-4", status: "22-05-22 18:15" },
    { title: "开发任务-6", status: "22-05-22 18:15" },
    { title: "测试任务-2", status: "22-05-22 18:15" },
  ]);
  const [doneList, setDoneList] = useState<Card[]>([
    { title: "开发任务-2", status: "22-05-22 18:15" },
    { title: "测试任务-1", status: "22-05-22 18:15" },
  ]);

  const handleSubmit = (title: string) => {
    setTodoList([{ title, status: new Date().toDateString() }, ...todoList]);
    setShowAdd(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main className="kanban-board">
        <section className="kanban-column column-todo">
          <h2>
            待处理
            <button onClick={() => setShowAdd(!showAdd)}>
              &#8853; 添加新卡片
            </button>
          </h2>
          <ul>
            {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
            {todoList.map((card, index) => (
              <KanbanCard key={index} {...card} />
            ))}
          </ul>
        </section>
        <section className="kanban-column column-ongoing">
          <h2>进行中</h2>
          <ul>
            {ongoingList.map((card, index) => (
              <KanbanCard key={index} {...card} />
            ))}
          </ul>
        </section>
        <section className="kanban-column column-done">
          <h2>已完成</h2>
          <ul>
            {doneList.map((card, index) => (
              <KanbanCard key={index} {...card} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default App;
