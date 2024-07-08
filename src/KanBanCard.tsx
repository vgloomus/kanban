/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";

interface Card {
  title: string;
  status: string;
  onDragStart?: any;
}

// 看板创建时间自动更新
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

export const kanbanCardStyles = css`
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

export const kanbanCardTitleStyles = css`
  min-height: 3rem;
`;

const KanBanCard: React.FC<Card> = ({ title, status, onDragStart }) => {
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

export default KanBanCard;
