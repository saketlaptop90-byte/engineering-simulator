import {
  steel,
  aluminum,
  darkSteel,
  blackPlastic,
  greenAccent,
  blueAccent,
  orangeAccent,
  yellowAccent
} from '../utils/materials.js';

export function createHighSpeedNetworkSwitch(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Modular Core Switch Chassis
  const chassisGeo = new THREE.BoxGeometry(8, 6, 4);
  const chassis = new THREE.Mesh(chassisGeo, darkSteel);
  chassis.position.y = 3;
  group.add(chassis);

  // Cooling fans array on the left
  const fanGroup = new THREE.Group();
  fanGroup.position.set(-3.5, 3, 2);
  group.add(fanGroup);
  
  const fanGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
  for(let i=0; i<4; i++) {
     const fan = new THREE.Mesh(fanGeo, blackPlastic);
     fan.rotation.x = Math.PI/2;
     fan.position.set(0, -1.8 + i*1.2, 0);
     fanGroup.add(fan);
  }

  // Line cards and Supervisor Engines
  const cardsGroup = new THREE.Group();
  cardsGroup.position.set(0.5, 3, 2);
  group.add(cardsGroup);

  const cardGeo = new THREE.BoxGeometry(6.5, 0.8, 0.2);
  const portGeo = new THREE.BoxGeometry(0.2, 0.2, 0.25);
  const tracks = [];

  for(let i=0; i<6; i++) {
     const cardY = -2.2 + i*0.88;
     const card = new THREE.Mesh(cardGeo, aluminum);
     card.position.set(0, cardY, 0);
     cardsGroup.add(card);
     
     // 16 Ports per line card (High density QSFP/SFP)
     for(let j=0; j<16; j++) {
        const portX = -2.8 + j*0.37;
        const port = new THREE.Mesh(portGeo, blackPlastic);
        port.position.set(portX, cardY, 0.05);
        cardsGroup.add(port);
        
        // Link/Activity LED
        const ledGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        const ledMat = greenAccent.clone();
        ledMat.emissive = new THREE.Color(0x00ff00);
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(portX, cardY + 0.15, 0.1);
        led.name = `switchPort_${i}_${j}`;
        cardsGroup.add(led);

        // Patch cables plugged in randomly
        if (Math.random() > 0.4) {
            const plugGeo = new THREE.BoxGeometry(0.15, 0.15, 0.4);
            const plug = new THREE.Mesh(plugGeo, steel);
            plug.position.set(portX, cardY, 0.25);
            cardsGroup.add(plug);

            // Fiber optic wire (yellow for single-mode, orange for multi-mode)
            const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
            const wireMat = Math.random() > 0.5 ? orangeAccent : yellowAccent;
            const wire = new THREE.Mesh(wireGeo, wireMat);
            wire.rotation.x = Math.PI / 2;
            wire.position.set(portX, cardY, 1.0);
            cardsGroup.add(wire);

            // Active port blinking traffic
            const offset = Math.random();
            const track = new THREE.NumberKeyframeTrack(
               `${led.name}.material.emissiveIntensity`,
               [0, offset, offset+0.05, offset+0.1, 1.0],
               [0.2, 1.0, 0.2, 1.0, 0.2]
            );
            tracks.push(track);
        } else {
            // Inactive/Unplugged port
            const track = new THREE.NumberKeyframeTrack(
               `${led.name}.material.emissiveIntensity`,
               [0, 1.0], [0, 0]
            );
            tracks.push(track);
        }
     }
  }

  animationClips.push(new THREE.AnimationClip('SwitchTraffic', 1.0, tracks));

  return { group, animationClips };
}
