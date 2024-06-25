/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";

import "./App.scss";
import logo from "./logo.svg";

interface Card {
  title: string;
  status: string;
  onDragStart?: any;
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

// 看板创建时间自动更新
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const DATA_STORE_KEY = "kanban-data-store";

//拖拽相关的枚举
const COLUMN_KEY_TODO = "todo";
const COLUMN_KEY_ONGOING = "ongoing";
const COLUMN_KEY_DONE = "done";

const KanbanCard: React.FC<Card> = ({ title, status, onDragStart }) => {
  const [displayTime, setDisplayTime] = useState(status);
  const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);

  // 更新时间
  function updateDisplayTime() {
    const timePassed = new Date() - new Date(status);
    let relativeTime = "刚刚";
    if (MINUTE <= timePassed && timePassed < HOUR) {
      relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
    } else if (HOUR <= timePassed && timePassed < DAY) {
      relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
    } else if (DAY <= timePassed) {
      relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
    }
    setDisplayTime(relativeTime);
  }

  function handleDragStart(e) {
    // 设置拖拽操作效果 表示被拖动的数据可以被移动到新位置
    e.dataTransfer.effectAllowed = "move";
    // 将要拖动的数据设置为文本类型，并传递拖动元素的标题
    e.dataTransfer.setData("text/plain", title);
    onDragStart && onDragStart(e);
  }

  useEffect(() => {
    // 在组件首次加载时会调用，并且每分钟一次设置到displayTime上
    updateDisplayTime();
    // 组件被卸载清除定时器
    clearInterval(intervalId);
  }, [status]);

  return (
    <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
      <div css={kanbanCardTitleStyles}>{title}</div>
      <div
        css={css`
          font-size: 0.8rem;
          text-align: right;
          color: #333333;
        `}
      >
        {displayTime}
      </div>
    </li>
  );
};

const KanbanNewCard: React.FC<KanbanNewCardProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const inputElement = useRef(null);

  useEffect(() => {
    inputElement.current.focus();
  }, []);

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
          ref={inputElement}
        />
      </div>
    </li>
  );
};

const App: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
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
  // 拖拽相关的state
  const [draggedItem, setDraggedItem] = useState<Card | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

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

  function handleSubmit(title: string) {
    setTodoList([{ title, status: new Date().toDateString() }, ...todoList]);
    setShowAdd(false);
  }

  function handleDrop(evt) {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }
    // 三个数组的更新函数套了一个索引对象,setTodoList == updaters[COLUMN_KEY_TODO] == updaters["todo"]
    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };
    if (dragSource) {
      updaters[dragSource]((currentStat) =>
        currentStat.filter((item) => !Object.is(item, draggedItem)),
      );
    }
    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [draggedItem, ...currentStat]);
    }
  }

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

  const KanBanColumn = ({
    children,
    bgColor,
    title,
    setIsDragSource = (a: Boolean) => {},
    setIsDragTarget = (b: Boolean) => {},
    onDrop,
  }) => {
    return (
      <section
        onDragStart={() => setIsDragSource(true)}
        onDragOver={(evt) => {
          evt.preventDefault();
          evt.dataTransfer.dropEffect = "move";
          setIsDragTarget(true);
        }}
        onDragLeave={(evt) => {
          evt.preventDefault();
          evt.dataTransfer.dropEffect = "none";
          setIsDragTarget(false);
        }}
        onDrop={(evt) => {
          evt.preventDefault();
          onDrop && onDrop(evt);
        }}
        onDragEnd={(evt) => {
          evt.preventDefault();
          setIsDragSource(false);
          setIsDragTarget(false);
        }}
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
    loading: "#E3E3E3",
  };

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
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanBanBoard>
        {isLoading ? (
          <div>加载中..............</div>
        ) : (
          <>
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
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_TODO : null)
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_TODO : null)
              }
              onDrop={handleDrop}
            >
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {todoList.map((item, index) => (
                <KanbanCard
                  key={index}
                  // 将当前拖动的item对象设置为draggedItem状态的新值，这样就能拖动当前列表里面的卡片
                  onDragStart={() => {
                    setDraggedItem(item);
                  }}
                  {...item}
                />
              ))}
            </KanBanColumn>
            <KanBanColumn
              bgColor={COLUMN_BG_COLORS.ongoing}
              title={"进行中"}
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_ONGOING : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_ONGOING : null)
              }
              onDrop={handleDrop}
            >
              {ongoingList.map((item, index) => (
                <KanbanCard
                  key={index}
                  onDragStart={() => {
                    setDraggedItem(item);
                  }}
                  {...item}
                />
              ))}
            </KanBanColumn>
            <KanBanColumn
              bgColor={COLUMN_BG_COLORS.done}
              title={"已完成"}
              setIsDragSource={(isDragSource) =>
                setDragSource(isDragSource ? COLUMN_KEY_DONE : null)
              }
              setIsDragTarget={(isDragTarget) =>
                setDragTarget(isDragTarget ? COLUMN_KEY_DONE : null)
              }
              onDrop={handleDrop}
            >
              {doneList.map((item, index) => (
                <KanbanCard
                  key={index}
                  onDragStart={() => {
                    setDraggedItem(item);
                  }}
                  {...item}
                />
              ))}
            </KanBanColumn>
          </>
        )}
      </KanBanBoard>
    </div>
  );
};

export default App;
