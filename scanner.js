var i2c, i2c1 = 0;

const EBUSY = 16; /* Device or resource busy */

class scanner {
	constructor(runReal) {
		if (runReal) {
			i2c = require('i2c-bus');
		} else {
			i2c = require('./Si4713/fakeI2C.js');
		}
	}
	scan(first, last) {
		first = first || 0x3;
		last = last || 0x77;
		return new Promise( (resolve, reject) => {
			var i2c1 = i2c.openSync(3); //open i2c bus
			if (!i2c1.i2cFuncsSync().smbusQuick) {
				return reject('Error: Can\'t use SMBus Quick Write command on this bus#');
			} else {
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
				i2c1.closeSync(); //close i2c bus
				return resolve();
			}

			process.stdout.write('\n');
		})
	}
}

module.exports = scanner;
