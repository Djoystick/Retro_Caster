import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

bad_pattern = r"""ПОНЯТНО\s*</button>\s*</div>\s*</motion\.div>\s*\)\}\s*</AnimatePresence>\s*</motion\.div>\s*\)\}"""

good_text = """ПОНЯТНО
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}"""

c = re.sub(bad_pattern, good_text, c)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Regex replace ran.")
