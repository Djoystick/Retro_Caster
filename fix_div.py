import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

bad = """                              ПОНЯТНО
                              </button>
                            </div>
                          </motion.div>"""
                          
good = """                              ПОНЯТНО
                              </button>
                          </motion.div>"""

c = c.replace(bad, good)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Extra div removed.")
