import { useState } from "react";

type VirtualizProps = {
  items: Array<any>;
  renderComponent: React.ComponentType<{ data: any; style: any }>;
  itemHeight: number;
};

// React elements need to start with a capital letter.
// We could have just renamed the prop to be capitalized, but usually React API involves the props being in camelCase so
// - capitalized seemed a bit awkward
const Virtualize = ({
  items,
  renderComponent: RenderComponent,
  itemHeight: ITEM_HEIGHT,
}: VirtualizProps) => {
  const WINDOW_SIZE = 120;
  const [scrollTop, setScrollTop] = useState(0);

  // scrollTop refers to how much in the component we have scrolled.
  // startIndex is being calculated as such: If ITEM_HEIGHT is 40 and scrollTop is 120, it means that we have scrolled past
  // 120/40 = 3 items, so start index will be 4. Clamping with 0 to ensure that startIndex is never lesser than 0 (is not needed but added as a safeguard)
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT));

  const endIndex = Math.min(
    items?.length - 1, // don't render past the end of the list
    Math.floor((scrollTop + WINDOW_SIZE) / ITEM_HEIGHT),
  );

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const itemsToDisplay: any[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    itemsToDisplay.push(items[i]);
  }

  const renderItems = itemsToDisplay.map((_, idx) => {
    const actualIndex = startIndex + idx;

    return (
      <RenderComponent
        key={items[actualIndex]}
        style={{
          position: "absolute",
          top: actualIndex * ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          width: "100%",
        }}
        data={items[actualIndex]}
      />
    );
  });

  const totalHeight = items.length * ITEM_HEIGHT;

  return (
    <>
      <div
        className="bg-gray-500 w-96 overflow-auto text-white"
        style={{ height: `${WINDOW_SIZE}px` }} // ✅ viewport stays small
        onScroll={onScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          {renderItems}
        </div>
      </div>
    </>
  );
};

export default Virtualize;

