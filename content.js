let is_active = false

// Create an overlay for highlighting elements
const overlay = document.createElement('div')
overlay.style.position = 'absolute'
overlay.style.border = '2px solid red'
overlay.style.pointerEvents = 'none'
document.body.appendChild(overlay)

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    is_active = message.is_active
    if (is_active) {
        document.addEventListener('mousemove', highlightElement)
        document.addEventListener('click', copyCssAndDeactivate)
    } else {
        document.removeEventListener('mousemove', highlightElement)
        document.removeEventListener('click', copyCssAndDeactivate)
        overlay.style.display = 'none'
    }
})

function highlightElement(e) {
    const target = e.target
    const rect = target.getBoundingClientRect()
    overlay.style.width = `${rect.width}px`
    overlay.style.height = `${rect.height}px`
    overlay.style.left = `${rect.left + window.scrollX}px`
    overlay.style.top = `${rect.top + window.scrollY}px`
}

function copyCssAndDeactivate(e) {
    const style = getComputedStyle(e.target)
    let lines = []
    for (const property of style) {
        if (style.getPropertyValue(property) !== '') {
            lines.push(`    ${property}: ${style.getPropertyValue(property)};`)
        }
    }
    const text = `{\n${lines.join('\n')}\n}`
    navigator.clipboard.writeText(text).then(() => {
        console.log('CSS copied to clipboard')
        chrome.runtime.sendMessage({ is_active: false })
    })
    e.preventDefault()
}
