// 注册上传占位符节点
const BlockEmbed = Quill.import('blots/block/embed')

class UploadPlaceholderBlot extends BlockEmbed {
  static blotName = 'uploadPlaceholder'
  static tagName = 'div'

  static create(value) {
    const node = super.create()
    node.setAttribute('data-local-id', value.localId)
    node.setAttribute('contenteditable', 'false')

    // 设置灰色区域样式
    node.style.display = 'flex'
    node.style.alignItems = 'center'
    node.style.justifyContent = 'center'
    node.style.width = '100%'
    node.style.height = '150px'
    node.style.backgroundColor = '#f0f0f0'
    node.style.borderRadius = '8px'
    node.style.border = '1px dashed #ccc'
    node.style.color = '#999'
    node.style.fontSize = '14px'
    node.style.margin = '10px 0'
    node.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-top: 8px;">上传中...</div>
      </div>
    `
    return node
  }

  static value(node) {
    return {
      localId: node.getAttribute('data-local-id')
    }
  }
}

Quill.register(UploadPlaceholderBlot)
