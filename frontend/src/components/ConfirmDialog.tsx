interface Props {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="secondary-btn" onClick={onCancel}>取消</button>
          <button className="danger-btn" onClick={onConfirm}>删除</button>
        </div>
      </div>
    </div>
  )
}
