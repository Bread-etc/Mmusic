export function Library() {
  return (
    <aside
      className="w-52 h-full rounded-lg p-4 flex-shrink-0 
    shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] bg-card/10 backdrop-blur-xl
    dark:shadow-[0px_2px_8px_0px_rgba(255,255,255,0.1)]"
    >
      <h2 className="text-title-small">音乐库</h2>
      {/* 歌单列表将在这里渲染 */}
      <div className="mt-2">
        <p className="text-caption">歌单列表...</p>
      </div>
    </aside>
  );
}
