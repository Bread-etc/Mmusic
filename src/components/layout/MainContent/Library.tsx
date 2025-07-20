export function Library() {
  return (
    <aside
      className="w-52 h-full rounded-lg p-2 flex-shrink-0 shadow-material
      bg-card/10 backdrop-blur-lg transition-colors duration-200
      border-solid border-transparent hover:border-primary border-2 app-region-no-drag"
    >
      <h2 className="text-title-small">音乐库</h2>
      {/* 歌单列表将在这里渲染 */}
      <div className="mt-2">
        <p className="text-caption">歌单列表...</p>
      </div>
    </aside>
  );
}
