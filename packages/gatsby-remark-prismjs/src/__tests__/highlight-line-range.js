const highlightLineRange = require(`../highlight-line-range`)
const fixtures = require(`./fixtures`)
const output = highlighted => highlighted.map(({ code }) => code).join(`\n`)
const getHighlighted = lines => lines.filter(line => line.highlighted)
describe(`highlighting a line range`, () => {
  describe(`highlight-line`, () => {
    it(`strips directive`, () => {
      const highlights = highlightLineRange(fixtures.highlightLine)
      expect(output(highlights)).not.toContain(`highlight-line`)
    })
    it(`highlights line`, () => {
      const highlights = highlightLineRange(fixtures.highlightLine)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`highlight-next-line`, () => {
    it(`strips directive`, () => {
      const highlights = highlightLineRange(fixtures.highlightNextLine)
      expect(output(highlights)).not.toContain(`highlight-next-line`)
    })
    it(`highlights correct line`, () => {
      const highlights = highlightLineRange(fixtures.highlightNextLine)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`highlight-start / highlight-end`, () => {
    it(`strips directives`, () => {
      const highlights = highlightLineRange(fixtures.highlightStartEnd)
      const code = output(highlights)
      ;[`highlight-start`, `highlight-end`].forEach(directive => {
        expect(code).not.toContain(directive)
      })
    })
    it(`highlights correct lines`, () => {
      const highlights = highlightLineRange(fixtures.highlightStartEnd)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
    it(`highlights without end directive`, () => {
      const highlights = highlightLineRange(fixtures.highlightStartWithoutEnd)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`highlight-range`, () => {
    it(`strips directives`, () => {
      const highlights = highlightLineRange(fixtures.highlightRange)
      expect(output(highlights)).not.toContain(`highlight-range`)
    })
    it(`highlights correct lines`, () => {
      const highlights = highlightLineRange(fixtures.highlightRange)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
    it(`does not highlight and warns if range is invalid`, () => {
      spyOn(console, `warn`)

      const highlights = highlightLineRange(fixtures.highlightRangeInvalid)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
      expect(console.warn).toHaveBeenCalledWith(
        `Invalid match specified: "// highlight-range"`
      )
    })
    it(`highlights until end of code block if ranges goes farther`, () => {
      const highlights = highlightLineRange(
        fixtures.highlightRangeLongerThanCode
      )
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`jsx comment`, () => {
    it(`removes directive`, () => {
      const highlights = highlightLineRange(fixtures.highlightJsxComment)
      expect(output(highlights)).not.toContain(`highlight-line`)
    })
    it(`highlights comment line`, () => {
      const highlights = highlightLineRange(fixtures.highlightJsxComment)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
    it(`highlights comment line after Prism highlighting`, () => {
      const highlights = highlightLineRange(
        fixtures.highlightJsxCommentAfterPrismHighlighting
      )
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`yaml`, () => {
    it(`strips directive`, () => {
      const highlights = highlightLineRange(fixtures.highlightYaml)
      expect(highlights).not.toContain(`highlight-line`)
    })
    it(`highlights yaml`, () => {
      const highlights = highlightLineRange(fixtures.highlightYaml)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
  describe(`kitchen sink`, () => {
    it(`strips directives`, () => {
      const highlights = highlightLineRange(fixtures.highlightKitchenSink)
      const code = output(highlights)
      ;[
        `highlight-line`,
        `highlight-next-line`,
        `highlight-range`,
        `highlight-start`,
        `highlight-end`,
      ].forEach(directive => {
        expect(code).not.toContain(directive)
      })
    })
    it(`highlights multiple directives`, () => {
      const highlights = highlightLineRange(fixtures.highlightKitchenSink)
      expect(output(getHighlighted(highlights))).toMatchSnapshot()
    })
  })
})
