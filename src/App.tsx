/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";

import "./App.scss";
import logo from "./logo.svg";

interface Card {
  title: string;
  status: string;
}

interface KanbanNewCardProps {
  onSubmit: (title: string) => void;
}

const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border: 1px solid gray;
  list-style: none;
  text-align: left;
  background-color: rgb(255 255 255 / 0.4);

  &:hover {
    box-shadow:
      0 0.2rem 0.2rem rgba(0, 0, 0, 0.2),
      inset 0 1px #fff;
  }
`;

const kanbanCardTitleStyles = css`
  min-height: 3rem;
`;

const KanbanCard: React.FC<Card> = ({ title, status }) => {
  return (
    <li css={kanbanCardStyles}>
      <div css={kanbanCardTitleStyles}>{title}</div>
      <div
        css={css`
          font-size: 0.8rem;
          text-align: right;
          color: #333333;
        `}
      >
        {status}
      </div>
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
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div
        css={css`
          ${kanbanCardTitleStyles}
          & > input[type="text"] {
            width: 80%;
          }
        `}
      >
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

  const KanBanBoard = ({ children }) => (
    <main
      css={css`
        display: flex;
        flex: 10;
        flex-direction: row;
        margin: 0 1rem 1rem;
        gap: 1rem;
      `}
    >
      {children}
    </main>
  );

  const KanBanColumn = ({ children, bgColor, title }) => {
    return (
      <section
        css={css`
          display: flex;
          flex: 1 1;
          flex-direction: column;
          border-radius: 1rem;
          border: 1px solid gray;
          background-color: ${bgColor};

          & > h2 {
            margin: 0.6rem 1rem;
            padding-bottom: 0.6rem;
            border-bottom: 1px solid gray;

            & > button {
              float: right;
              height: 1.8rem;
              margin-top: 0.2rem;
              padding: 0.2rem 0.5rem;
              border-radius: 1rem;
              border: 0;
              font-size: 1rem;
              line-height: 1rem;
            }
          }

          & > ul {
            flex: 1;
            flex-basis: 0;
            overflow: auto;
            margin: 1rem;
            padding: 0;
          }
        `}
      >
        <h1>{title}</h1>
        <ul>{children}</ul>
      </section>
    );
  };

  const COLUMN_BG_COLORS = {
    todo: "#C9AF97",
    ongoing: "#FFE799",
    done: "#C0E88A",
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanBanBoard>
        <KanBanColumn
          bgColor={COLUMN_BG_COLORS.todo}
          title={
            <>
              待处理
              <button onClick={() => setShowAdd(!showAdd)}>
                &#8853; 添加新卡片
              </button>
            </>
          }
        >
          {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
          {todoList.map((card, index) => (
            <KanbanCard key={index} {...card} />
          ))}
        </KanBanColumn>
        <KanBanColumn bgColor={COLUMN_BG_COLORS.ongoing} title={"进行中"}>
          {ongoingList.map((card, index) => (
            <KanbanCard key={index} {...card} />
          ))}
        </KanBanColumn>
        <KanBanColumn bgColor={COLUMN_BG_COLORS.done} title={"已完成"}>
          {doneList.map((card, index) => (
            <KanbanCard key={index} {...card} />
          ))}
        </KanBanColumn>
      </KanBanBoard>
    </div>
  );
};

export default App;
