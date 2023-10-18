import { useState, useEffect } from "react";
import Teros12Card from "/components/stations/Teros12Card.js";
import BatteryCard from "/components/stations/BatteryCard.js";
import Teros10Card from "/components/stations/Teros10Card.js";
import SM100Card from "/components/stations/SM100Card.js";
import ValveCard from "/components/stations/ValveCard.js";

const DEVICE_CARDS = {
  "teros-12": Teros12Card,
  "teros-10": Teros10Card,
  "sm-100": SM100Card,
  "battery": BatteryCard,
  "valve": ValveCard,
};

export default function DeviceCard({ device }) {
  const [deviceComponent, setDeviceComponent] = useState(null);

  useEffect(() => {
    if (device && device.nombre) {
      const Component = DEVICE_CARDS[device.type];
      setDeviceComponent(() => Component);
    }
  }, [device]);

  const DeviceComponent = deviceComponent;

  return (
    <>
      {DeviceComponent ? (
        <DeviceComponent device={device} />
      ) : (
        <div>No component found for this device type</div>
      )}
    </>
  );
}
