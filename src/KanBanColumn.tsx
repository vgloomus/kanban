/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";

import KanBanCard from "./KanBanCard.tsx";
import KanBanNewCard from "./KanBanNewCard.tsx";

interface Card {
  title: string;
  status: string;
  onDragStart?: any;
}

// 1、对于KanbanColumn组件的理解，它是容器，能够显示标题和列表，还能处理拖拽事件
export default function KanBanColumn({
  cardList = [] as Card[],
  setDraggedItem,
  bgColor,
  title,
  setIsDragSource = (a: Boolean) => {},
  setIsDragTarget = (b: Boolean) => {},
  onDrop,
  canAddNew = false,
  onAdd,
}) {
  const [showAdd, setShowAdd] = useState(false);

  function handleAdd(evt) {
    setShowAdd(true);
  }

  function handleSubmit(newcard) {
    onAdd && onAdd(newcard);
    setShowAdd(false);
  }

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
      <h2>
        {title}
        {canAddNew && (
          <button onClick={handleAdd} disabled={showAdd}>
            &#8853; 添加新卡片
          </button>
        )}
      </h2>
      <ul>
        <>
          {canAddNew && showAdd && <KanBanNewCard onSubmit={handleSubmit} />}
          {/* 踩了个坑，cardList.map((props) => { ... }); 使用了大括号 {} 而不是小括号 () 来包裹 KanBanCard 组件的 JSX 返回语句。这样的写法会导致 map 函数没有返回值，因为箭头函数 {} 中没有显式的 return 语句。 */}
          {cardList.map((props) => (
            <KanBanCard
              key={props.title}
              onDragStart={() => setDraggedItem && setDraggedItem(props)}
              {...props}
            />
          ))}
        </>
      </ul>
    </section>
  );
}
