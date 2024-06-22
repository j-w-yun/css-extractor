(() => {
    let is_active = false

    // Create an overlay for highlighting elements
    const $overlay = document.createElement('div')
    $overlay.style.position = 'absolute'
    $overlay.style.border = '2px solid red'
    $overlay.style.pointerEvents = 'none'
    // $overlay.style.display = 'none'
    $overlay.style.zIndex = '999999'
    $overlay.style.transition = 'all 100ms ease-in-out'
    document.body.appendChild($overlay)

    // Toast setup for notifications
    const $toast = document.createElement('div')
    $toast.style.position = 'fixed'
    $toast.style.top = '20px'
    $toast.style.left = '50%'
    $toast.style.transform = 'translateX(-50%)'
    $toast.style.backgroundColor = '#333'
    $toast.style.color = 'white'
    $toast.style.padding = '10px 20px'
    $toast.style.borderRadius = '5px'
    $toast.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'
    $toast.style.display = 'none'
    $toast.style.zIndex = '10000'
    $toast.style.transition = 'opacity 0.5s'
    document.body.appendChild($toast)

    function show_toast(message) {
        $toast.textContent = message
        $toast.style.display = 'block'
        $toast.style.opacity = '1'
        setTimeout(() => {
            $toast.style.opacity = '0'
            setTimeout(() => $toast.style.display = 'none', 500)
        }, 3000)
    }

    function highlight_hovered(e) {
        if (!e.target) return
        const rect = e.target.getBoundingClientRect()
        if (!rect) return
        $overlay.style.width = `${rect.width}px`
        $overlay.style.height = `${rect.height}px`
        $overlay.style.left = `${rect.left + window.scrollX}px`
        $overlay.style.top = `${rect.top + window.scrollY}px`
    }

    function create_dummy(tag) {
        const dummy = document.createElement(tag)
        dummy.style.display = 'none'
        document.body.appendChild(dummy)
        return dummy
    }

    function copy_css(e) {
        if (!e.target) return
        const dummy = create_dummy(e.target.tagName)
        const style = getComputedStyle(e.target)
        const dummy_style = getComputedStyle(dummy)
        let lines = []
        for (const property of style) {
            if (style.getPropertyValue(property) !== dummy_style.getPropertyValue(property)) {
                lines.push(`    ${property}: ${style.getPropertyValue(property)};`)
            }
        }
        const text = `{\n${lines.join('\n')}\n}`
        navigator.clipboard.writeText(text).then(() => {
            console.log(text)
            console.log('CSS copied to clipboard')
            show_toast('CSS copied to clipboard')
            chrome.runtime.sendMessage({ is_active: false })
        })
        e.preventDefault()
        e.stopImmediatePropagation()
        deactivate()
    }

    function deactivate() {
        document.removeEventListener('mousemove', highlight_hovered)
        document.removeEventListener('click', copy_css)
        $overlay.style.display = 'none'
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message,) => {
        is_active = message.is_active
        if (!is_active) return deactivate()
        document.addEventListener('mousemove', highlight_hovered)
        document.addEventListener('click', copy_css)
    })
})()
