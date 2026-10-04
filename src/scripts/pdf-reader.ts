import type { PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

export function setupPdfReader(reader: HTMLElement) {
  const previous = reader.querySelector<HTMLButtonElement>('[data-pdf-previous]')!
  const next = reader.querySelector<HTMLButtonElement>('[data-pdf-next]')!
  const zoom = reader.querySelector<HTMLSelectElement>('[data-pdf-zoom]')!
  const count = reader.querySelector<HTMLElement>('[data-pdf-count]')!
  const message = reader.querySelector<HTMLElement>('[data-pdf-message]')!
  const viewport = reader.querySelector<HTMLElement>('[data-pdf-viewport]')!
  const canvas = reader.querySelector<HTMLCanvasElement>('[data-pdf-canvas]')!
  let pdf: PDFDocumentProxy | undefined
  let pageNumber = 1
  let rendering = false
  let renderAgain = false
  let failed = false

  function updateControls() {
    const busy = !pdf || rendering || failed
    previous.disabled = busy || pageNumber === 1
    next.disabled = busy || pageNumber === pdf?.numPages
    zoom.disabled = busy
    reader.setAttribute('aria-busy', String(rendering))
  }

  function showError(error: unknown) {
    failed = true
    viewport.hidden = true
    message.hidden = false
    message.textContent =
      error instanceof Error && error.name === 'PasswordException'
        ? '这份 PDF 有密码保护，请打开原文件阅读。'
        : '暂时无法预览这份 PDF，请通过上方入口打开原文件。'
    updateControls()
  }

  // Only one render may own the canvas. Resize requests are coalesced while busy.
  async function renderPage() {
    if (!pdf || failed) return
    if (rendering) {
      renderAgain = true
      return
    }
    rendering = true
    updateControls()
    try {
      const page = await pdf.getPage(pageNumber)
      const unscaled = page.getViewport({ scale: 1 })
      const fitWidth = Math.max(200, reader.clientWidth - 26)
      const scale = (fitWidth / unscaled.width) * Number(zoom.value)
      const pageViewport = page.getViewport({ scale })
      // Bound raster memory on high-density screens and unusually tall pages.
      const pixelRatio = Math.min(
        devicePixelRatio || 1,
        2,
        8192 / Math.max(pageViewport.width, pageViewport.height)
      )
      canvas.width = Math.ceil(pageViewport.width * pixelRatio)
      canvas.height = Math.ceil(pageViewport.height * pixelRatio)
      canvas.style.width = `${pageViewport.width}px`
      canvas.style.height = `${pageViewport.height}px`
      await page.render({
        canvas,
        viewport: pageViewport,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0]
      }).promise
      count.textContent = `${pageNumber} / ${pdf.numPages}`
      canvas.setAttribute(
        'aria-label',
        `${reader.dataset.title} — 第 ${pageNumber} 页，共 ${pdf.numPages} 页`
      )
      message.hidden = true
      viewport.hidden = false
      viewport.scrollTo({ top: 0, left: 0 })
      page.cleanup()
    } catch (error) {
      showError(error)
    } finally {
      rendering = false
      updateControls()
      if (renderAgain) {
        renderAgain = false
        void renderPage()
      }
    }
  }

  previous.addEventListener('click', () => {
    pageNumber--
    void renderPage()
  })
  next.addEventListener('click', () => {
    pageNumber++
    void renderPage()
  })
  zoom.addEventListener('change', () => {
    void renderPage()
  })

  let width = reader.clientWidth
  const resizeObserver = new ResizeObserver(() => {
    if (Math.abs(reader.clientWidth - width) < 1) return
    width = reader.clientWidth
    void renderPage()
  })
  resizeObserver.observe(reader)

  async function load() {
    try {
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
      GlobalWorkerOptions.workerSrc = workerUrl
      pdf = await getDocument({
        url: reader.dataset.src!,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/pdfjs/standard_fonts/',
        wasmUrl: '/pdfjs/wasm/',
        iccUrl: '/pdfjs/iccs/'
      }).promise
      await renderPage()
    } catch (error) {
      showError(error)
    }
  }

  // Load the reader only when its attachment approaches the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        void load()
      }
    },
    { rootMargin: '400px' }
  )
  observer.observe(reader)
}
