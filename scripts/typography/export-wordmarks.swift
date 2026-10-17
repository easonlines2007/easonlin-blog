// Run from the repository root: swift scripts/typography/export-wordmarks.swift
// Requires a locally installed Michelangelus Italic; exports only fixed artwork.
import Foundation
import CoreText
import CoreGraphics
let font = CTFontCreateWithName("Michelangelus-Italic" as CFString, 100, nil)
guard CTFontCopyPostScriptName(font) as String == "Michelangelus-Italic" else {
 fatalError("Install Michelangelus Italic locally before exporting the wordmarks.")
}
for (slug, text) in [("blog", "Eason's blog"), ("name", "Eason Lin")] {
 let tracking = slug == "blog" ? -2.0 : -2.5
 let line = CTLineCreateWithAttributedString(NSAttributedString(string:text, attributes:[NSAttributedString.Key(kCTFontAttributeName as String):font, NSAttributedString.Key(kCTKernAttributeName as String): tracking]))
 let combined = CGMutablePath()
 for run in CTLineGetGlyphRuns(line) as! [CTRun] {
  let count = CTRunGetGlyphCount(run)
  var glyphs = [CGGlyph](repeating:0,count:count)
  var positions = [CGPoint](repeating:.zero,count:count)
  CTRunGetGlyphs(run, CFRange(location:0,length:0), &glyphs)
  CTRunGetPositions(run, CFRange(location:0,length:0), &positions)
  for i in 0..<count { if let path = CTFontCreatePathForGlyph(font,glyphs[i],nil) { combined.addPath(path,transform:CGAffineTransform(translationX:positions[i].x,y:positions[i].y)) } }
 }
 let box=combined.boundingBoxOfPath.insetBy(dx:-1,dy:-1)
 var d=""
 combined.applyWithBlock { element in
  let e=element.pointee; let p=e.points
  func point(_ i:Int)->String { return "\(p[i].x) \(-p[i].y)" }
  switch e.type {
  case .moveToPoint: d += "M\(point(0))"
  case .addLineToPoint: d += "L\(point(0))"
  case .addQuadCurveToPoint: d += "Q\(point(0)) \(point(1))"
  case .addCurveToPoint: d += "C\(point(0)) \(point(1)) \(point(2))"
  case .closeSubpath: d += "Z"
  @unknown default: break
  }
 }
 let svg="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"\(box.minX) \(-box.maxY) \(box.width) \(box.height)\"><path d=\"\(d)\"/></svg>\n"
 try svg.write(toFile:"src/assets/wordmarks/wordmark-\(slug).svg", atomically:true,encoding:.utf8)
 print(slug,box.width,box.height)
}
