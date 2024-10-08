// 文字列のバイト数を調べる
function getStringByteCount(str: string) {
  const blob = new Blob([str], { type: "text/plain" });
  return blob.size;
}

function countGrapheme(target: string) {
  // Need to update Typescript; It's a Typescript Bug
  // TS2339: Property 'Segmenter' does not exist on type 'typeof Intl'.
  // https://github.com/denoland/deno/issues/14182

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const { length } = [...segmenter.segment(target)];

  // console.log(`${target} length : ${length}`);
  return length;
}

export { getStringByteCount, countGrapheme };
