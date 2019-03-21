const i2c = require('i2c-bus');
const i2c1 = i2c.openSync(3);

const EBUSY = 16; /* Device or resource busy */

class scanner {
    constructor(first, last) {
      process.stdout.write('     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f');

      for (let addr = 0; addr <= 127; addr += 1) {
        if (addr % 16 === 0) {
          process.stdout.write('\n' + (addr === 0 ? '0' : ''));
          process.stdout.write(addr.toString(16) + ':');
        }

        if (addr < first || addr > last) {
          process.stdout.write('   ');
        } else {
          try {
            i2c1.writeQuickSync(addr, 0);
            process.stdout.write(' ' + addr.toString(16)); // device found, print addr
          } catch (e) {
            if (e.errno === EBUSY) {
              process.stdout.write(' UU');
            } else {
              process.stdout.write(' --');
            }
          }
        }
      }

      process.stdout.write('\n');
    }
}


if (!i2c1.i2cFuncsSync().smbusQuick) {
  process.stdout.write('Error: Can\'t use SMBus Quick Write command on this bus#');
} else {
  let scan = new scanner(0x3, 0x77);
  i2c1.closeSync(); //close bus
}

module.exports = scanner;
