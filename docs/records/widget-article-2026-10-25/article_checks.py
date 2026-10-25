from html.parser import HTMLParser
import hashlib, re

class Article(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta={}; self.canonical=None; self.title=[]; self.h1=[]; self.date=[]
        self.datetime=None; self.content=[]; self.anchors=[]; self.strong=[]
        self.depth=0; self.in_title=False; self.in_h1=False; self.in_time=False
        self.anchor=None; self.bold=None; self.ordered_items=0; self.in_ol=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="meta": self.meta[a.get("name",a.get("property",""))]=a.get("content","")
        if tag=="link" and a.get("rel")=="canonical": self.canonical=a.get("href")
        if tag=="title":self.in_title=True
        if tag=="h1":self.in_h1=True
        if tag=="time":self.in_time=True;self.datetime=a.get("datetime")
        if tag=="div" and "post-content" in a.get("class","").split(): self.depth=1
        elif self.depth and tag not in ["meta","link","br","hr","img","input","source","wbr"]:self.depth+=1
        if self.depth:
            if tag=="a":self.anchor={"href":a.get("href"),"text":[]}
            if tag=="strong":self.bold=[]
            if tag=="ol":self.in_ol+=1
            if tag=="li" and self.in_ol:self.ordered_items+=1
    def handle_endtag(self,tag):
        if tag in ["meta","link","br","hr","img","input","source","wbr"]:return
        if tag=="title":self.in_title=False
        if tag=="h1":self.in_h1=False
        if tag=="time":self.in_time=False
        if self.depth:
            if tag=="a" and self.anchor:
                self.anchor["text"]="".join(self.anchor["text"]).strip();self.anchors.append(self.anchor);self.anchor=None
            if tag=="strong" and self.bold is not None:self.strong.append("".join(self.bold));self.bold=None
            if tag=="ol":self.in_ol-=1
            self.depth-=1
    def handle_data(self,data):
        if self.in_title:self.title.append(data)
        if self.in_h1:self.h1.append(data)
        if self.in_time:self.date.append(data)
        if self.depth:
            self.content.append(data)
            if self.anchor is not None:self.anchor["text"].append(data)
            if self.bold is not None:self.bold.append(data)
    def result(self):
        text=re.sub(r"\s+"," "," ".join(self.content)).strip()
        return {"title":"".join(self.title),"h1":"".join(self.h1),"description":self.meta.get("description"),"canonical":self.canonical,"datetime":self.datetime,"displayed_date":"".join(self.date),"body_text":text,"body_text_sha256":hashlib.sha256(text.encode()).hexdigest(),"anchors":self.anchors,"strong_texts":self.strong,"ordered_items":self.ordered_items}

def inspect(html):
    p=Article();p.feed(html);return p.result()

def validate(result):
    title="사진 한 장으로 남기는 육아일기, 위젯에서 다시 보기"
    assert result["h1"]==title,result["h1"]
    assert result["title"]==title+" - 작은 위로",result["title"]
    assert result["description"]=="사진 한 장과 짧은 기록을 남기고, 홈 화면 위젯에서 보던 사진과 문구를 작은 위로 앱에서도 이어 보는 방법을 소개합니다."
    assert result["canonical"]=="https://tinymoments.site/blog/from-widget-to-the-same-moment/"
    assert result["datetime"].startswith("2026-10-09")
    assert result["displayed_date"]=="2026년 10월 9일"
    links=[a for a in result["anchors"] if a["href"]=="https://apps.apple.com/kr/app/id6763057739"]
    assert [a["text"] for a in links]==["App Store에서 작은 위로 살펴보기","App Store에서 작은 위로 받기"],links
    assert {"href":"/release/v1-4-0/","text":"v1.4.0 릴리스 노트"} in result["anchors"]
    assert result["ordered_items"]==3 and len(result["strong_texts"])==3
    return result
