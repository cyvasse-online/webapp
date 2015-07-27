all: \
	css/rule-set.css \
	css/style.css \
	\
	rule-sets/mikelepage.html \
	\
	static-text/legal-notice-de.html \
	static-text/legal-notice-en.html \
	static-text/what-is-cyvasse.html

%.html: %.md
	@mkdir -p $(@D)
	$(AM_V_GEN)$(MARKDOWN) -x tables -f $@ $<

## sourcemaps generate paths to .scss files the browser can't find
## resulting in no debug possibility at all [tested in FF 35.0]
%.css: %.scss
	@mkdir -p $(@D)
	$(AM_V_GEN)$(SASS) --sourcemap=none $< $@
