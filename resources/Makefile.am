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

## Copy scss files to the build directory so browsers can load them for debugging
%.css : %.scss
	@mkdir -p $(@D)
	cp --update $< $(@D)/$(<F)
	$(AM_V_GEN)$(SASS) $< $@
