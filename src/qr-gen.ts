import { crc16 } from "./crc";

function emvField(num: number, data: string) {
  return (
    num.toString().padStart(2, "0") +
    data.length.toString().padStart(2, "0") +
    data
  );
}

export function generate(phone: string, amount: string) {
  const qr =
    [
      emvField(0, "01"),
      emvField(1, "12"),
      emvField(
        29,
        [emvField(0, "A000000677010111"), emvField(1, "0066" + phone.substr(-9,9))].join("")
      ),
      emvField(58, "TH"),
      emvField(53, "764"),
      emvField(54, (+amount).toFixed(2)),
    ].join("") + "6304";

  const qrFull = qr + crc16(qr).toString(16).toUpperCase();

  return qrFull
}
