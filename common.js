/* Constants */
const SENSORS_GRAVITY_EARTH            = (9.80665)              /**< Earth's gravity in m/s^2 */
const SENSORS_GRAVITY_MOON             = (1.6)                  /**< The moon's gravity in m/s^2 */
const SENSORS_GRAVITY_SUN              = (275.0)                /**< The sun's gravity in m/s^2 */
const SENSORS_GRAVITY_STANDARD         = (SENSORS_GRAVITY_EARTH)
const SENSORS_MAGFIELD_EARTH_MAX       = (60.0)                 /**< Maximum magnetic field on Earth's surface */
const SENSORS_MAGFIELD_EARTH_MIN       = (30.0)                 /**< Minimum magnetic field on Earth's surface */
const SENSORS_PRESSURE_SEALEVELHPA     = (1013.25)              /**< Average sea level pressure is 1013.25 hPa */
const SENSORS_DPS_TO_RADS              = (0.017453293)          /**< Degrees/s to rad/s multiplier */
const SENSORS_GAUSS_TO_MICROTESLA      = (100)                   /**< Gauss to micro-Tesla multiplier */
const sensor_constants = {SENSORS_GRAVITY_EARTH: SENSORS_GRAVITY_EARTH, SENSORS_GRAVITY_MOON: SENSORS_GRAVITY_MOON, SENSORS_GRAVITY_SUN: SENSORS_GRAVITY_SUN, SENSORS_GRAVITY_STANDARD: SENSORS_GRAVITY_STANDARD, SENSORS_MAGFIELD_EARTH_MAX: SENSORS_MAGFIELD_EARTH_MAX, SENSORS_MAGFIELD_EARTH_MIN: SENSORS_MAGFIELD_EARTH_MIN, SENSORS_PRESSURE_SEALEVELHPA: SENSORS_PRESSURE_SEALEVELHPA, SENSORS_DPS_TO_RADS: SENSORS_DPS_TO_RADS, SENSORS_GAUSS_TO_MICROTESLA: SENSORS_GAUSS_TO_MICROTESLA}
//^object containing all sensor constants

/** Sensor types */
const sensor_types = {
  SENSOR_TYPE_ACCELEROMETER:         (1),   /**< Gravity + linear acceleration */
  SENSOR_TYPE_MAGNETIC_FIELD:        (2),
  SENSOR_TYPE_ORIENTATION:           (3),
  SENSOR_TYPE_GYROSCOPE:             (4),
  SENSOR_TYPE_LIGHT:                 (5),
  SENSOR_TYPE_PRESSURE:              (6),
  SENSOR_TYPE_PROXIMITY:             (8),
  SENSOR_TYPE_GRAVITY:               (9),
  SENSOR_TYPE_LINEAR_ACCELERATION:   (10),  /**< Acceleration not including gravity */
  SENSOR_TYPE_ROTATION_VECTOR:       (11),
  SENSOR_TYPE_RELATIVE_HUMIDITY:     (12),
  SENSOR_TYPE_AMBIENT_TEMPERATURE:   (13),
  SENSOR_TYPE_VOLTAGE:               (15),
  SENSOR_TYPE_CURRENT:               (16),
  SENSOR_TYPE_COLOR:                 (17),
  SENSOR_TYPE_UNKNOWN: 				       (18)
};

const sensors_axes = {
  X: 1,
  Y: 2,
  Z: 3
};
const sensor_value_types = {
  XYZ: 1, //XYZ coordinate system
  RPH: 2, //RPH (roll pitch heading)
  V: 3, //V
  RGB: 4,
  C: 5
}

const sensor_event_types = {
  ORIENTATION: 0,
  ACCELERATION: 1,
  GYRO: 2,
  MAGNETIC: 3,
  DISTANCE: 4,
  LIGHT: 5,
  COLOR: 6,
  VOLTAGE: 7,
  CURRENT: 8,
  PRESSURE: 9,
  TEMPERATURE: 10,
  DATA: 11
}

/** struct sensors_vec is used to return a vector in a common format. */
class sensor_vec {
	status = 0;
	reserved = [];
  constructor(v1, v2, v3, type = sensor_value_types.XYZ) {
    switch(type) {
      case sensor_value_types.XYZ:
        this.x = v1;
        this.y = v2; 
        this.z = v3;
      break;
      case sensor_value_types.V:
        this.v = v1;
      break;
      case sensor_value_types.RPH: /* Orientation sensors */
        this.roll = v1; /**< Rotation around the longitudinal axis (the plane body, 'X axis'). Roll is positive and increasing when moving downward. -90°<=roll<=90° */
        this.pitch = v2; /**< Rotation around the lateral axis (the wing span, 'Y axis'). Pitch is positive and increasing when moving upwards. -180°<=pitch<=180°) */
        this.heading = v3; /**< Angle between the longitudinal axis (the plane body) and magnetic north, measured clockwise when viewing from the top of the device. 0-359° */
      break;
    }
  }
}

/** struct sensors_color_s is used to return color data in a common format. */
class sensor_color {
  rgba = 0; /**< 24-bit RGBA value */
  constructor(v1, v2, v3, type = sensor_value_types.RGB) {
    switch(type) {
      case sensor_value_types.RGB: /* RGB color space */
        this.r = v1; /**< Red component */
        this.g = v2; /**< Green component */
        this.b = v3; /**< Blue component */
      break;
      case sensor_value_types.C:
        this.c = v1;
      break;
    }
  }
}

/* Sensor details (40 bytes) */
/** struct sensor is used to describe basic information about a specific sensor. */
class sensor {
  _autoRange = false;
    constructor(name = "default", version = 1, sensor_id = 1, type = sensor_types.SENSOR_TYPE_UNKNOWN, max_value = 1, min_value = 0, resolution = 1, min_delay = 0) {
      this.name = name; /**< sensor name */
      this.version = version; /**< version of the hardware + driver */
      this.sensor_id = sensor_id; /**< unique sensor identifier */
      this.type = type; /**< this sensor's type (ex. SENSOR_TYPE_LIGHT) */
      this.max_value = max_value; /**< maximum value of this sensor's value in SI units */
      this.min_value = min_value; /**< minimum value of this sensor's value in SI units */
      this.resolution = resolution; /**< smallest difference between two values reported by this sensor */
      this.min_delay = min_delay; /**< min delay in microseconds between events. zero = not a constant rate */
    }
    getSensor() { //defined by subclass
      return this;
    }
    getEvent() {} //defined by subclass
    enableAutoRange(enable) {
      this.autoRange = (enable) ? true : false; //force boolean
    }
}
const sensorReference = sensor; //leave a reference to sensor for other classes to use

/* Sensor event (36 bytes) */
/** struct sensor_event_s is used to provide a single sensor event in a common format. */
class sensor_event {
  reserved0 = 0; /**< reserved */
  constructor(sensor = new sensorReference(), eventType, v1, v2, v3) {
    this.version = sensor.version; /**< must be sizeof(struct sensors_event_t) nvm I'm actually going to implement this a bit differently*/
    this.sensor_id = sensor.sensor_id; /**< unique sensor identifier */
    this.type = sensor.type; /**< sensor type */
    this.timestamp = new Date().getTime(); /**< time is in milliseconds */

    let vecT; //sensor vector placeholder
    let colT; //sensor color placeholder

    switch(eventType) {
      case sensor_event_types.ORIENTATION: /**< orientation values are in degrees */
        vecT = new sensor_vec(v1, v2, v3, sensor_value_types.RPH);
        this.orientation = {
          roll: vecT.roll,
          pitch: vecT.pitch,
          heading: vecT.heading
        }
      break;

      case sensor_event_types.ACCELERATION: /**< acceleration values are in meter per second per second (m/s^2) */
        vecT = new sensor_vec(v1, v2, v3, sensor_value_types.XYZ);
        this.acceleration = {
          x: vecT.x,
          y: vecT.y,
          z: vecT.z
        }
      break;

      case sensor_event_types.MAGNETIC: /**< magnetic vector values are in micro-Tesla (uT) */
        vecT = new sensor_vec(v1, v2, v3, sensor_value_types.XYZ);
        this.magnetic = {
          x: vecT.x,
          y: vecT.y,
          z: vecT.z
        }
      break;

      case sensor_event_types.GYRO: /**< gyroscope values are in rad/s */
        vecT = new sensor_vec(v1, v2, v3, sensor_value_types.XYZ);
        this.gyro = {
          x: vecT.x,
          y: vecT.y,
          z: vecT.z
        }
      break;

      case sensor_event_types.COLOR: /**< color in RGB component values */
        colT = new sensor_color(v1, v2, v3, sensor_value_types.RGB);
        this.color = {
          r: colT.r,
          g: colT.g,
          b: colT.b
        }
      break;

      case sensor_event_types.VOLTAGE: /**< voltage in volts (V) */
        this.voltage = v1;
      break;

      case sensor_event_types.CURRENT: /**< current in milliamps (mA) */
        this.current = v1;
      break;

      case sensor_event_types.RELATIVE_HUMIDITY: /**< relative humidity in percent */
        this.relative_humidity = v1;
      break;

      case sensor_event_types.PRESSURE: /**< pressure in hectopascal (hPa) */
        this.pressure = v1;
      break;

      case sensor_event_types.LIGHT: /**< light in SI lux units */
        this.light = v1;
      break;

      case sensor_event_types.DISTANCE: /**< distance in centimeters */
        this.distance = v1;
      break;

      case sensor_event_types.TEMPERATURE: /**< temperature is in degrees centigrade (Celsius) */
        this.temperature = v1;
      break;

      case sensor_event_types.DATA:
        this.data = v1;
      break;

    }
  }
}

module.exports = {
  sensor_types: sensor_types, //sensor types
  sensor_constants: sensor_constants, //sensor constants
  sensor: sensor, //sensor constructor
  sensor_axes: sensor_axes,
  sensor_value_types: sensor_value_types,
  sensor_event_types: sensor_event_types,

  sensor_vec: sensor_vec, //sensor vector constructor
  sensor_color: sensor_color,
  sensor_event: sensor_event

}