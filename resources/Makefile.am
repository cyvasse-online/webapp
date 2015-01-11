all: \
	css/style.css \
	\
	rule-sets/mikelepage.html \
	\
	static-text/what-is-cyvasse.html

%.html : %.md
	@mkdir -p $(@D)
	$(AM_V_GEN)$(MARKDOWN) -x tables -f $@ $<

%.css : %.scss
	@mkdir -p $(@D)
	$(AM_V_GEN)$(SASS) $< $@
