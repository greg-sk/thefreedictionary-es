#!/bin/bash

usage() {
  echo "es - Spanish-Spanish dictionary from thefreedictionary.com"
  echo "Usage:"
  echo "    es <word>"
  exit 0
}

if [ $# -eq 1 ] && [ "$1" = "-h" ]; then
  usage
fi

if [ $# -eq 0 ]; then
  # Show translations to other languages of the last word queried with 'es'
  last=`ls -tR $HOME/.es/*.htm | head -n 1`
  if [ -n "$last" ]; then
    w3m -dump -cols 180 $last | grep -A 1000 'Traducciones' | head -n -3
  fi
fi

mkdir -p "$HOME/.es"
cd "$HOME/.es"
word="$1"
final=${word}.final

if [ -e $final ]; then
  cat $final
  exit 0
fi

curl -L -s http://es.thefreedictionary.com/p/$word > ${word}.htm

grep "Palabra no encontrada" ${word}.htm > /dev/null && { rm $HOME/.es/${word}.htm; echo "Not found" > $final; cat $final; exit 0; }

w3m -dump -cols 180 ${word}.htm > ${word}.txt
csplit -f xx ${word}.txt '/Sin.nimos/' > /dev/null 2>&1 || cp ${word}.txt xx00
csplit -f yy xx00 '/Gerund:/' > /dev/null 2>&1 || cp xx00 yy00
csplit -f zz xx01 '/Traducciones/' > /dev/null 2>&1 || touch zz00

tail -n +3 yy00 | head -n -2  > $final
echo >> $final
cat zz00 >> $final

rm -f $HOME/.es/*.txt
rm -f $HOME/.es/xx*
rm -f $HOME/.es/yy*
rm -f $HOME/.es/zz*


nlines=`wc -l $final | awk '{print $1}'`
if [ "$nlines" -lt 6 ]; then
  ese >> $final
fi

cat $final
