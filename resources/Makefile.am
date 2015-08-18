cssFiles = \
	css/rule-set.css \
	css/style.css

htmlFiles = \
	rule-sets/mikelepage.html \
	\
	static-text/legal-notice-de.html \
	static-text/legal-notice-en.html \
	static-text/what-is-cyvasse.html

generatedFiles = \
	$(cssFiles) \
	$(htmlFiles)

all: $(generatedFiles)

clean:
	test -z "$(generatedFiles) $(cssFiles:.css=.scss)" || rm -f $(generatedFiles) $(cssFiles:.css=.scss)

%.html: %.md
	@mkdir -p $(@D)
	$(AM_V_GEN)$(MARKDOWN) -x tables -f $@ $<

## Copy scss files to the build directory so browsers can load them for debugging
## Use $(srcdir)/css/$(<F) instead of $< because make otherwise finds the copied
## scss files and tries to compile them which can lead to all sorts of problems.
## This only works because all the CSS files are in the same directory. But it works.
css/%.css : css/%.scss
	@mkdir -p $(@D)
	@cp --update $(srcdir)/css/$(<F) $(<F) > /dev/null || true
	$(AM_V_GEN)$(SASS) $(srcdir)/css/$(<F) $@
