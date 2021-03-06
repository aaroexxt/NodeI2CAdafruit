//Definitions/Constants for Si4713

module.exports.SI4710_ADDR0 = 0x11;  // if SEN is low
module.exports.SI4710_ADDR1 = 0x63;  // if SEN is high, default!
module.exports.SI4710_STATUS_CTS = 0x80;

/* COMMANDS */
module.exports.SI4710_CMD_POWER_UP     = 0x01;
module.exports.SI4710_CMD_GET_REV      = 0x10;
module.exports.SI4710_CMD_POWER_DOWN   = 0x11;
module.exports.SI4710_CMD_SET_PROPERTY = 0x12;
module.exports.SI4710_CMD_GET_PROPERTY = 0x13;
module.exports.SI4710_CMD_GET_INT_STATUS = 0x14;
module.exports.SI4710_CMD_PATCH_ARGS = 0x15;
module.exports.SI4710_CMD_PATCH_DATA = 0x16;
module.exports.SI4710_CMD_TX_TUNE_FREQ = 0x30;
module.exports.SI4710_CMD_TX_TUNE_POWER = 0x31;
module.exports.SI4710_CMD_TX_TUNE_MEASURE = 0x32;
module.exports.SI4710_CMD_TX_TUNE_STATUS = 0x33;
module.exports.SI4710_CMD_TX_ASQ_STATUS = 0x34;
module.exports.SI4710_CMD_TX_RDS_BUFF = 0x35;
module.exports.SI4710_CMD_TX_RDS_PS = 0x36;
module.exports.SI4710_CMD_TX_AGC_OVERRIDE = 0x48;
module.exports.SI4710_CMD_GPO_CTL = 0x80;
module.exports.SI4710_CMD_GPO_SET = 0x81;

/* Parameters */

module.exports.SI4713_PROP_GPO_IEN = 0x0001;
module.exports.SI4713_PROP_DIGITAL_INPUT_FORMAT = 0x0101;
module.exports.SI4713_PROP_DIGITAL_INPUT_SAMPLE_RATE = 0x0103;
module.exports.SI4713_PROP_REFCLK_FREQ = 0x0201;
module.exports.SI4713_PROP_REFCLK_PRESCALE = 0x0202;
module.exports.SI4713_PROP_TX_COMPONENT_ENABLE = 0x2100;
module.exports.SI4713_PROP_TX_AUDIO_DEVIATION = 0x2101;
module.exports.SI4713_PROP_TX_PILOT_DEVIATION = 0x2102;
module.exports.SI4713_PROP_TX_RDS_DEVIATION = 0x2103;
module.exports.SI4713_PROP_TX_LINE_LEVEL_INPUT_LEVEL = 0x2104;
module.exports.SI4713_PROP_TX_LINE_INPUT_MUTE = 0x2105;
module.exports.SI4713_PROP_TX_PREEMPHASIS = 0x2106;
module.exports.SI4713_PROP_TX_PILOT_FREQUENCY = 0x2107;
module.exports.SI4713_PROP_TX_ACOMP_ENABLE = 0x2200;
module.exports.SI4713_PROP_TX_ACOMP_THRESHOLD = 0x2201;
module.exports.SI4713_PROP_TX_ATTACK_TIME = 0x2202;
module.exports.SI4713_PROP_TX_RELEASE_TIME = 0x2203;
module.exports.SI4713_PROP_TX_ACOMP_GAIN = 0x2204;
module.exports.SI4713_PROP_TX_LIMITER_RELEASE_TIME = 0x2205;
module.exports.SI4713_PROP_TX_ASQ_INTERRUPT_SOURCE = 0x2300;
module.exports.SI4713_PROP_TX_ASQ_LEVEL_LOW = 0x2301;
module.exports.SI4713_PROP_TX_ASQ_DURATION_LOW = 0x2302;
module.exports.SI4713_PROP_TX_AQS_LEVEL_HIGH = 0x2303;
module.exports.SI4713_PROP_TX_AQS_DURATION_HIGH = 0x2304;
//RDS Properties
module.exports.SI4713_PROP_TX_RDS_INTERRUPT_SOURCE = 0x2C00;
module.exports.SI4713_PROP_TX_RDS_PI = 0x2C01;
module.exports.SI4713_PROP_TX_RDS_PS_MIX = 0x2C02;
module.exports.SI4713_PROP_TX_RDS_PS_MISC = 0x2C03;
module.exports.SI4713_PROP_TX_RDS_PS_REPEAT_COUNT = 0x2C04;
module.exports.SI4713_PROP_TX_RDS_MESSAGE_COUNT = 0x2C05;
module.exports.SI4713_PROP_TX_RDS_PS_AF = 0x2C06;
module.exports.SI4713_PROP_TX_RDS_FIFO_SIZE = 0x2C07;


//inefficient asf gtfo
/*
module.exports = {
	SI4710_ADDR0: SI4710_ADDR0,
	SI4710_ADDR1: SI4710_ADDR1,
	SI4710_STATUS_CTS: SI4710_STATUS_CTS,
	SI4710_CMD_POWER_UP: SI4710_CMD_POWER_UP,
	SI4710_CMD_GET_REV: SI4710_CMD_GET_REV,
	SI4710_CMD_POWER_DOWN: SI4710_CMD_POWER_DOWN,
	SI4710_CMD_SET_PROPERTY: SI4710_CMD_SET_PROPERTY,
	SI4710_CMD_GET_PROPERTY: SI4710_CMD_GET_PROPERTY
	SI4710_CMD_GET_INT_STATUS: SI4710_CMD_GET_INT_STATUS,
	SI4710_CMD_PATCH_ARGS: SI4710_CMD_PATCH_ARGS,
	SI4710_CMD_PATCH_DATA: SI4710_CMD_PATCH_DATA,
	SI4710_CMD_TX_TUNE_FREQ: SI4710_CMD_TX_TUNE_FREQ,
	SI4710_CMD_TX_TUNE_POWER: SI4710_CMD_TX_TUNE_POWER,
	SI4710_CMD_TX_TUNE_MEASURE: SI4710_CMD_TX_TUNE_MEASURE,
	SI4710_CMD_TX_TUNE_STATUS: SI4710_CMD_TX_TUNE_STATUS,
	SI4710_CMD_TX_ASQ_STATUS: SI4710_CMD_TX_ASQ_STATUS,
	SI4710_CMD_TX_RDS_BUFF: SI4710_CMD_TX_RDS_BUFF,
	SI4710_CMD_TX_RDS_PS: SI4710_CMD_TX_RDS_PS,
	SI4710_CMD_TX_AGC_OVERRIDE: SI4710_CMD_TX_AGC_OVERRIDE,
	SI4710_CMD_GPO_CTL: SI4710_CMD_GPO_CTL,
	SI4710_CMD_GPO_SET: SI4710_CMD_GPO_SET,
	SI4713_PROP_GPO_IEN: SI4713_PROP_GPO_IEN,
	SI4713_PROP_DIGITAL_INPUT_FORMAT: SI4713_PROP_DIGITAL_INPUT_FORMAT,
	SI4713_PROP_DIGITAL_INPUT_SAMPLE_RATE: SI4713_PROP_DIGITAL_INPUT_SAMPLE_RATE,
	SI4713_PROP_REFCLK_FREQ: SI4713_PROP_REFCLK_FREQ,
	SI4713_PROP_REFCLK_PRESCALE: SI4713_PROP_REFCLK_PRESCALE,
	SI4713_PROP_TX_COMPONENT_ENABLE: SI4713_PROP_TX_COMPONENT_ENABLE,
	SI4713_PROP_TX_AUDIO_DEVIATION: SI4713_PROP_TX_AUDIO_DEVIATION,
	SI4713_PROP_TX_PILOT_DEVIATION: SI4713_PROP_TX_PILOT_DEVIATION,
	SI4713_PROP_TX_RDS_DEVIATION: SI4713_PROP_TX_RDS_DEVIATION,
	SI4713_PROP_TX_LINE_LEVEL_INPUT_LEVEL: SI4713_PROP_TX_LINE_LEVEL_INPUT_LEVEL,
	SI4713_PROP_TX_LINE_INPUT_MUTE: SI4713_PROP_TX_LINE_INPUT_MUTE,
	SI4713_PROP_TX_PREEMPHASIS: SI4713_PROP_TX_PREEMPHASIS,
	SI4713_PROP_TX_PILOT_FREQUENCY: SI4713_PROP_TX_PILOT_FREQUENCY,
	SI4713_PROP_TX_ACOMP_ENABLE: SI4713_PROP_TX_ACOMP_ENABLE,
	SI4713_PROP_TX_ACOMP_THRESHOLD: SI4713_PROP_TX_ACOMP_THRESHOLD,
	SI4713_PROP_TX_ATTACK_TIME: SI4713_PROP_TX_ATTACK_TIME,
	SI4713_PROP_TX_RELEASE_TIME: SI4713_PROP_TX_RELEASE_TIME,
	SI4713_PROP_TX_ACOMP_GAIN: SI4713_PROP_TX_ACOMP_GAIN, 
	SI4713_PROP_TX_LIMITER_RELEASE_TIME: SI4713_PROP_TX_LIMITER_RELEASE_TIME,
	SI4713_PROP_TX_ASQ_INTERRUPT_SOURCE: SI4713_PROP_TX_ASQ_INTERRUPT_SOURCE,
	SI4713_PROP_TX_ASQ_LEVEL_LOW: SI4713_PROP_TX_ASQ_LEVEL_LOW,
	SI4713_PROP_TX_ASQ_DURATION_LOW: SI4713_PROP_TX_ASQ_DURATION_LOW,
	SI4713_PROP_TX_AQS_LEVEL_HIGH: SI4713_PROP_TX_AQS_LEVEL_HIGH,
	SI4713_PROP_TX_AQS_DURATION_HIGH: SI4713_PROP_TX_AQS_DURATION_HIGH,
	SI4713_PROP_TX_RDS_INTERRUPT_SOURCE: SI4713_PROP_TX_RDS_INTERRUPT_SOURCE,
	SI4713_PROP_TX_RDS_PI: SI4713_PROP_TX_RDS_PI, 
	SI4713_PROP_TX_RDS_PS_MIX: SI4713_PROP_TX_RDS_PS_MIX,
	SI4713_PROP_TX_RDS_PS_MISC: SI4713_PROP_TX_RDS_PS_MISC, 
	SI4713_PROP_TX_RDS_PS_REPEAT_COUNT: SI4713_PROP_TX_RDS_PS_REPEAT_COUNT,
	SI4713_PROP_TX_RDS_MESSAGE_COUNT: SI4713_PROP_TX_RDS_MESSAGE_COUNT,
	SI4713_PROP_TX_RDS_PS_AF: SI4713_PROP_TX_RDS_PS_AF,
	SI4713_PROP_TX_RDS_FIFO_SIZE: SI4713_PROP_TX_RDS_FIFO_SIZE
}
*/