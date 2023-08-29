const randomProperty = (obj) => {
    let keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

const cekimle = (str) => {
    if (str === "births") return "doğdu";
    else if (str === "deaths") return "vefat etti";
}

var finalText;

if ([1, 3, 5, 7, 8, 10, 12].includes(new Date().getUTCMonth + 1)) {
    document.querySelector("option[value='31']").hidden = false;
}
else document.querySelector("option[value='31']").hidden = true;

document.querySelector("select#ay").addEventListener("change", () => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(document.querySelector("select#ay").value)) {
        document.querySelector("option[value='31']").hidden = false;
    }
    else document.querySelector("option[value='31']").hidden = true;
});

const cevir = (str) => {
    return fetch(`https://api.mymemory.translated.net/get?q=${str}&langpair=en|tr`)
        .then(res => { return res.json() })
        .then(data => {
            finalText = data.responseData.translatedText;
        });
}

const yukle = (filename, text) => {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
  
    element.style.display = "none";
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

document.querySelector("button").addEventListener("click", () => {
    let month = document.querySelector("select#ay").value;
    let day = document.querySelector("select#gun").value;
    let type = document.querySelector("select#tur").value;
    if (type == "invalid") {
        document.querySelector(".sonuc p").innerHTML = "<b style=\"color:red;\">Bir tür seç</b>";
    }
    else {
        document.querySelector(".sonuc .loading").style.display = "block";
        fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`)
            .then(res => res.json())
            .then(data => {
                document.querySelector(".loading").style.display = "none";
                if (!(type == "invalid") && !(type == "any")) {
                    let chosen = randomProperty(data[type]);
                    cevir(chosen.text).then(() => {
                        document.querySelector(".sonuc p").innerHTML = `<b>${day} ${document.querySelector("select#ay").options[document.querySelector("select#ay").selectedIndex].text} ${chosen.year ? chosen.year : ""}</b> <br /><br /> <i>${type == "births" || type == "deaths" ? chosen.text.split(", ")[0] : finalText} ${cekimle(type) ? cekimle(type) + "." : ""}</i>`;
                    }).then(() => {
                        document.querySelector(".sonuc .ekBilgi").style.display = "block";
                        document.querySelector(".sonuc button#paylas").style.display = "block";
                        if (type == "births" || type == "deaths") {
                            cevir(chosen.text.substring(chosen.text.split(", ")[0].length + 2, chosen.text.length)).then(() => {
                                document.querySelector(".sonuc .ekBilgi details .index").innerHTML = finalText;
                            });
                        }
                        else {
                            document.querySelector(".sonuc .ekBilgi details .index").innerHTML = "Ek bilgi bulunamadı.";
                        }
                    });
                }
                else if (type == "any") {
                    let alt = randomProperty(data);
                    let chosen = alt[Math.floor(Math.random() * Object.keys(alt).length)];
                    cevir(chosen.text).then(() => {
                        document.querySelector(".sonuc p").innerHTML = `<b>${day} ${document.querySelector("select#ay").options[document.querySelector("select#ay").selectedIndex].text} ${chosen.year ? chosen.year : ""}</b> <br /><br /> <i>${alt == "births" || alt == "deaths" ? chosen.text.split(", ")[0] : finalText} ${cekimle(alt) ? cekimle(alt) + "." : ""}.</i>`;
                    }).then(() => {
                        document.querySelector(".sonuc .ekBilgi").style.display = "block";
                        document.querySelector(".sonuc button#paylas").style.display = "block";
                        if (type == "births" || type == "deaths") {
                            cevir(chosen.text.substring(chosen.text.split(", ")[0].length + 2, chosen.text.length)).then(() => {
                                document.querySelector(".sonuc .ekBilgi details .index").innerHTML = finalText;
                            });
                        }
                        else {
                            document.querySelector(".sonuc .ekBilgi details .index").innerHTML = "Ek bilgi bulunamadı.";
                        }
                    });
                }
            });
    }
});

document.querySelector("#katkiAc").addEventListener("click", () => {
    document.querySelector(".katki").style.display = "block";
    document.querySelector(".perde").style.display = "block";
    document.body.style.overflow = "hidden";
});

document.querySelector(".katki .kapat").addEventListener("click", () => {
    document.querySelector(".katki").style.display = "none";
    document.querySelector(".perde").style.display = "none";
    document.body.style.overflow = "auto";
});

var d = new Date();

document.querySelector("select#ay").childNodes[2 * d.getUTCMonth() + 1].selected = true;
document.querySelector("select#gun").options[d.getUTCDate() - 1].selected = true;

document.querySelector(".sonuc button#paylas").addEventListener("click", () => {
    document.querySelector(".paylasma").style.display = "block";
    document.querySelector(".perde").style.display = "block";
    document.body.style.overflow = "hidden";
});

document.querySelector(".paylasma .kapat").addEventListener("click", () => {
    document.querySelector(".paylasma").style.display = "none";
    document.querySelector(".perde").style.display = "none";
    document.body.style.overflow = "auto";
});

document.querySelector(".container .kutu i.fa-twitter").addEventListener("click", () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(document.querySelector(".sonuc p b").innerHTML + ": " + document.querySelector(".sonuc p i").innerHTML)}`);
});

document.querySelector(".container .kutu i.fa-whatsapp").addEventListener("click", () => {
    window.open(`https://wa.me?text=${encodeURIComponent(document.querySelector(".sonuc p b").innerHTML + ": " + document.querySelector(".sonuc p i").innerHTML)}`);
});

document.querySelector(".container .kutu i.fa-copy").addEventListener("click", () => {
    navigator.clipboard.writeText(document.querySelector(".sonuc p b").innerHTML + ": " + document.querySelector(".sonuc p i").innerHTML);
    alert("Metin panoya kopyalandı!");
});

document.querySelector(".container .kutu i.fa-file-download").addEventListener("click", () => {
    yukle(`tarihtebugun-${document.querySelector(".sonuc p b").innerHTML.toLowerCase().replaceAll(" ", "")}.txt`, document.querySelector(".sonuc p b").innerHTML + ": " + document.querySelector(".sonuc p i").innerHTML);
});
