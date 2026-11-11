# Footnotes are lettered (a, b, c) and sources numbered ([1], [2]), following Wikipedia's
# split between explanatory notes and citations, so a footnote marker never shares a label
# with a source on the same page.
#
# kramdown numbers footnote markers 1, 2, 3 in order of first use. After conversion, this
# swaps each marker's number for its bracketed letter, [a], as Wikipedia shows them (bare
# lowercase was too small to read in the superscript mono), and gives the footnote list type="a", which
# letters it in browsers and feed readers alike, under a "// footnotes" label to match
# the "// sources" label in the post layout. Only the visible text changes: the
# #fn:N and #fnref:N anchors kramdown generates stay as they are.

module LetteredFootnotes
  MARKER = %r{(<a href="#fn:[^"]+" class="footnote"[^>]*>)(\d+)(</a>)}
  LIST = %r{(<div class="footnotes"[^>]*>)\s*<ol>}

  # 1 -> a, 26 -> z, 27 -> aa
  def self.letter(n)
    label = +""
    while n.positive?
      n -= 1
      label.prepend((97 + (n % 26)).chr)
      n /= 26
    end
    label
  end

  def self.apply(html)
    return html unless html.include?('class="footnote"')

    html
      .gsub(MARKER) { "#{Regexp.last_match(1)}[#{letter(Regexp.last_match(2).to_i)}]#{Regexp.last_match(3)}" }
      .sub(LIST) { "#{Regexp.last_match(1)}\n  <span class=\"label\">// footnotes</span>\n  <ol type=\"a\">" }
  end
end

Jekyll::Hooks.register [:documents, :pages], :post_convert do |doc|
  doc.content = LetteredFootnotes.apply(doc.content)
end
