(() => {
    const $overlay = document.createElement('div')

    // @ts-ignore
    if (window.is_css_extension_active) return deactivate()  // Check if the extension is already active
    // @ts-ignore
    window.is_css_extension_active = true

    let $current = null
    $overlay.style.position = 'fixed'
    $overlay.style.border = '2px solid red'
    $overlay.style.pointerEvents = 'none'
    $overlay.style.zIndex = '2147483647'
    $overlay.style.transition = 'all 100ms ease-in-out'
    $overlay.style.outline = '1px solid #fff'
    $overlay.style.outlineOffset = '-2px'
    $overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
    document.documentElement.appendChild($overlay)

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
    document.documentElement.appendChild($toast)

    function show_toast(message) {
        console.log(message)
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
        $current = e.target
        update_overlay()
    }

    function update_overlay() {
        if ($current) {
            const rect = $current.getBoundingClientRect()
            $overlay.style.width = `${rect.width}px`
            $overlay.style.height = `${rect.height}px`
            $overlay.style.left = `${rect.left}px`
            $overlay.style.top = `${rect.top}px`
        }
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
        navigator.clipboard.writeText(text).then(() => show_toast('CSS copied to clipboard'))
        deactivate()
        if (e.preventDefault) e.preventDefault()
        if (e.stopImmediatePropagation) e.stopImmediatePropagation()
    }

    function on_keydown(e) {
        console.log('on_keydown', e)
        if (e.ctrlKey && e.key === 'c') {
            copy_css({ target: $current })
            e.preventDefault()
        }
    }

    function deactivate() {
        // @ts-ignore
        window.is_css_extension_active = false
        window.removeEventListener('scroll', update_overlay, true)
        window.removeEventListener('resize', update_overlay, true)
        window.removeEventListener('mousemove', highlight_hovered)
        window.removeEventListener('click', copy_css)
        document.removeEventListener('keydown', on_keydown)
        if ($overlay.parentNode) $overlay.parentNode.removeChild($overlay)
    }

    window.addEventListener('scroll', update_overlay, true)
    window.addEventListener('resize', update_overlay, true)
    window.addEventListener('mousemove', highlight_hovered)
    window.addEventListener('click', copy_css)
    document.addEventListener('keydown', on_keydown)
})()
