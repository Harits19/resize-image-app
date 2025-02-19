export function smallestRatio(size1: number, size2: number): string {
  if (size1 === 0 && size2 === 0) {
    return "Undefined ratio (0:0)";
  } else if (size1 === 0) {
    return "0:1";
  } else if (size2 === 0) {
    return "1:0";
  }

  function gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  const commonDivisor: number = gcd(size1, size2);

  const simplifiedSize1: number = size1 / commonDivisor;
  const simplifiedSize2: number = size2 / commonDivisor;

  return `${simplifiedSize1}:${simplifiedSize2}`;
}

export function getFilenameWithoutExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename;
  } else {
    return filename.substring(0, lastDotIndex);
  }
}

export function downloadBlob({
  blob,
  filename,
}: {
  blob?: Blob;
  filename?: string;
}) {
  if (!blob) {
    console.log("blob data is empty");

    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename ?? "Empty name";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
