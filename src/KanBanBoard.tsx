/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";

import KanBanColumn from "./KanBanColumn.tsx";

interface Card {
  title: string;
  status: string;
  onDragStart?: any;
}
// 每列的背景
const COLUMN_BG_COLORS = {
  loading: "#E3E3E3",
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
};

//拖拽相关的枚举
export const COLUMN_KEY_TODO = "todo";
export const COLUMN_KEY_ONGOING = "ongoing";
export const COLUMN_KEY_DONE = "done";

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

export default function KanBanBoard({
  isLoading = true,
  todoList,
  ongoingList,
  doneList,
  onAdd,
  onRemove,
}) {
  // 拖拽相关的state
  const [draggedItem, setDraggedItem] = useState<Card | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  function handleDrop(evt) {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }
    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  }

  return (
    <main css={kanbanBoardStyles}>
      {isLoading ? (
        <div>加载中..............</div>
      ) : (
        <>
          <KanBanColumn
            bgColor={COLUMN_BG_COLORS.todo}
            title={"待处理"}
            setIsDragSource={(isSrc) =>
              setDragSource(isSrc ? COLUMN_KEY_TODO : null)
            }
            setIsDragTarget={(isTgt) =>
              setDragTarget(isTgt ? COLUMN_KEY_TODO : null)
            }
            onDrop={handleDrop}
            setDraggedItem={setDraggedItem}
            cardList={todoList}
            canAddNew
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
          ></KanBanColumn>
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
            setDraggedItem={setDraggedItem}
            cardList={ongoingList}
          ></KanBanColumn>
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
            setDraggedItem={setDraggedItem}
            cardList={doneList}
            onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
          ></KanBanColumn>
        </>
      )}
    </main>
  );
}
