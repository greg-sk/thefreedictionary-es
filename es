#!/bin/bash

usage() {
  echo "es - Spanish-Spanis dictionary from thefreedictionary.com"
  echo "Usage:"
  echo "    es <word>"
  exit 1
}

[ $# -eq 1 ] || usage

mkdir -p "$HOME/.es"
cd "$HOME/.es"
word="$1"
final=${word}.final

if [ -e $final ]; then
  cat $final
  exit 0
fi

curl -s http://es.thefreedictionary.com/p/$word > ${word}.htm

grep "Palabra no encontrada" ${word}.htm > /dev/null && { rm $HOME/.es/${word}.htm; echo "Not found" > $final; cat $final; exit 0; }

w3m -dump ${word}.htm > ${word}.txt
csplit -f xx ${word}.txt '/Sin.nimos/' > /dev/null 2>&1
csplit -f yy xx00 '/Gerund:/' > /dev/null 2>&1 || cp xx00 yy00
csplit -f zz xx01 '/Traducciones/' > /dev/null 2>&1

tail -n +3 yy00 | head -n -2  > $final
echo >> $final
cat zz00 >> $final

rm -f $HOME/.es/*.txt
rm -f $HOME/.es/xx*
rm -f $HOME/.es/yy*
rm -f $HOME/.es/zz*

cat $final
