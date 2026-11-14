import sys
from pptx import Presentation
from pptx.util import Emu
p=Presentation(sys.argv[1])
print('slide size',p.slide_width,p.slide_height)
for si,s in enumerate(p.slides,1):
    print(f'=== SLIDE {si} layout={s.slide_layout.name}')
    for sh in s.shapes:
        t=sh.shape_type
        line=f' [{sh.shape_id}] {sh.name!r} {t} pos=({sh.left},{sh.top}) size=({sh.width},{sh.height})'
        if sh.has_text_frame:
            for pi,para in enumerate(sh.text_frame.paragraphs):
                runs=[r.text for r in para.runs]
                if any(x.strip() for x in runs):
                    sz=[r.font.size.pt if r.font.size else None for r in para.runs]
                    line+=f'\n     p{pi}: {runs} sz={sz}'
        if sh.shape_type==6:  # group
            for g in sh.shapes:
                line+=f'\n     G[{g.shape_id}] {g.name!r} {g.has_text_frame and g.text_frame.text!r}'
        print(line)
