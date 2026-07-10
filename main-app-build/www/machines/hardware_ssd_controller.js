import * as materials from '../utils/materials.js';

export function createSSDController(THREE) {
    const group = new THREE.Group();
    const clips = [];

    // M.2 PCB
    const pcbGeo = new THREE.BoxGeometry(2.2, 0.08, 8.0);
    const pcb = new THREE.Mesh(pcbGeo, materials.greenPCB);
    group.add(pcb);

    // Connector pins
    const pinGeo = new THREE.BoxGeometry(2.0, 0.085, 0.5);
    const pin = new THREE.Mesh(pinGeo, materials.gold);
    pin.position.set(0, 0, -3.75);
    group.add(pin);

    // Controller
    const controllerGeo = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    const ctrlMat = materials.ceramic.clone();
    ctrlMat.emissive = new THREE.Color(0xffaa00);
    const controller = new THREE.Mesh(controllerGeo, ctrlMat);
    controller.position.set(0, 0.115, -2.0);
    controller.name = "SSDController";
    group.add(controller);

    // DRAM Cache
    const dramGeo = new THREE.BoxGeometry(1.0, 0.1, 0.8);
    const dram = new THREE.Mesh(dramGeo, materials.blackPlastic);
    dram.position.set(0, 0.09, -0.5);
    group.add(dram);

    // NAND Flash
    const nandGeo = new THREE.BoxGeometry(1.4, 0.12, 1.8);
    const nand1 = new THREE.Mesh(nandGeo, materials.blackPlastic);
    nand1.position.set(0, 0.1, 1.5);
    const nand2 = new THREE.Mesh(nandGeo, materials.blackPlastic);
    nand2.position.set(0, 0.1, 3.5);
    group.add(nand1, nand2);

    // Status LED
    const ledGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const ledMat = materials.glass.clone();
    ledMat.emissive = new THREE.Color(0xff0000);
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.9, 0.05, -3.2);
    led.name = "StatusLED";
    group.add(led);

    // Animations: Controller pulse and LED blink
    const ctrlTrack = new THREE.NumberKeyframeTrack('SSDController.material.emissiveIntensity', [0, 1, 2], [0.1, 0.5, 0.1]);
    
    // LED blink fast
    const ledTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const ledVals = [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0];
    const ledTrack = new THREE.NumberKeyframeTrack('StatusLED.material.emissiveIntensity', ledTimes, ledVals);
    
    clips.push(new THREE.AnimationClip('DriveActivity', 2, [ctrlTrack, ledTrack]));

    return { group, animationClips: clips };
}
