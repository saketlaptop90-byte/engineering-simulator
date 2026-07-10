export function createPacemaker(THREE) {
    const group = new THREE.Group();

    // 1. Pulse Generator casing
    const casingGeo = new THREE.BoxGeometry(2, 2.5, 0.5);
    const casingMat = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc, 
        metalness: 0.8, 
        roughness: 0.3,
        transparent: true,
        opacity: 0.4
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.name = "Pulse Generator casing";
    group.add(casing);

    // 2. Battery
    const batteryGeo = new THREE.BoxGeometry(1.6, 1.0, 0.4);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(0, -0.6, 0);
    battery.name = "Battery";
    group.add(battery);

    // 3. Circuitry
    const circuitGeo = new THREE.BoxGeometry(1.6, 0.8, 0.4);
    const circuitMat = new THREE.MeshStandardMaterial({ color: 0x005500, metalness: 0.3, roughness: 0.5 });
    const circuitry = new THREE.Mesh(circuitGeo, circuitMat);
    circuitry.position.set(0, 0.5, 0);
    circuitry.name = "Circuitry";
    group.add(circuitry);

    // 4. Header
    const headerGeo = new THREE.BoxGeometry(1.5, 0.6, 0.4);
    const headerMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.7 });
    const header = new THREE.Mesh(headerGeo, headerMat);
    header.position.set(0, 1.55, 0);
    header.name = "Header";
    group.add(header);

    // 5. Programmer Interface
    const interfaceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.55, 16);
    const interfaceMat = new THREE.MeshStandardMaterial({ color: 0x000088 });
    const programmerInterface = new THREE.Mesh(interfaceGeo, interfaceMat);
    programmerInterface.rotation.x = Math.PI / 2;
    programmerInterface.position.set(0.4, 0.5, 0);
    programmerInterface.name = "Programmer Interface";
    group.add(programmerInterface);

    // 6. Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9 });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(-0.5, 0.5, 0.2);
    antenna.rotation.x = Math.PI / 2;
    antenna.name = "Antenna";
    group.add(antenna);

    // Wires path
    class LeadCurve extends THREE.Curve {
        constructor(scale = 1, offset = 0) {
            super();
            this.scale = scale;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = this.offset + t * 4; 
            const ty = 1.55 - t * 3.55; 
            const tz = Math.sin(t * Math.PI) * 2; 
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const path1 = new LeadCurve(1, -0.2);
    const leadGeo1 = new THREE.TubeGeometry(path1, 32, 0.04, 8, false);
    const leadMat1 = new THREE.MeshStandardMaterial({ color: 0x111111 });
    
    // 7. Lead Wire 1
    const leadWire1 = new THREE.Mesh(leadGeo1, leadMat1);
    leadWire1.name = "Lead Wire 1";
    group.add(leadWire1);

    const path2 = new LeadCurve(1, 0.2);
    const leadGeo2 = new THREE.TubeGeometry(path2, 32, 0.04, 8, false);
    const leadMat2 = new THREE.MeshStandardMaterial({ color: 0x222222 });
    
    // 8. Lead Wire 2
    const leadWire2 = new THREE.Mesh(leadGeo2, leadMat2);
    leadWire2.name = "Lead Wire 2";
    group.add(leadWire2);

    // End points of leads are at t=1
    const endPt1 = path1.getPoint(1);
    const endPt2 = path2.getPoint(1);
    const midEndPt = new THREE.Vector3().addVectors(endPt1, endPt2).multiplyScalar(0.5);

    // 9. Electrode Tip
    const tipGeo = new THREE.CylinderGeometry(0.1, 0.02, 0.5);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, emissive: 0x000000 });
    const electrodeTip = new THREE.Mesh(tipGeo, tipMat);
    electrodeTip.position.copy(midEndPt);
    
    const tangent = path1.getTangent(1);
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
    const radians = Math.acos(up.dot(tangent));
    electrodeTip.quaternion.setFromAxisAngle(axis, radians);
    electrodeTip.name = "Electrode Tip";
    group.add(electrodeTip);

    // 10. Heart Muscle Patch
    const muscleGeo = new THREE.BoxGeometry(2, 2, 0.2);
    const muscleMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.9, emissive: 0x220000 });
    const heartMusclePatch = new THREE.Mesh(muscleGeo, muscleMat);
    heartMusclePatch.position.copy(midEndPt).add(tangent.clone().multiplyScalar(0.2));
    heartMusclePatch.quaternion.setFromAxisAngle(axis, radians);
    heartMusclePatch.name = "Heart Muscle Patch";
    group.add(heartMusclePatch);

    // VFX Pulses
    const pulseGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const pulse1 = new THREE.Mesh(pulseGeo, pulseMat);
    const pulse2 = new THREE.Mesh(pulseGeo, pulseMat);
    pulse1.name = "VFX Pulse 1";
    pulse2.name = "VFX Pulse 2";
    group.add(pulse1);
    group.add(pulse2);

    group.tick = (time) => {
        const t = time % 1.0; 
        
        pulse1.position.copy(path1.getPoint(t));
        pulse2.position.copy(path2.getPoint(t));

        if (t > 0.85) {
            const intensity = Math.sin(((t - 0.85) / 0.15) * Math.PI);
            electrodeTip.material.emissive.setHex(0x00ffff);
            electrodeTip.material.emissiveIntensity = intensity * 2;
            heartMusclePatch.material.emissive.setHex(0xff0000);
            heartMusclePatch.material.emissiveIntensity = 0.2 + intensity * 0.8;
        } else {
            electrodeTip.material.emissive.setHex(0x000000);
            heartMusclePatch.material.emissive.setHex(0x220000);
            heartMusclePatch.material.emissiveIntensity = 0.2;
        }
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the Pulse Generator casing?",
            options: [
                "To house the battery and circuitry securely",
                "To measure blood pressure",
                "To provide oxygen to the heart",
                "To directly pump blood"
            ],
            answer: 0
        },
        {
            question: "What component provides the long-term energy needed to run the pacemaker?",
            options: [
                "Antenna",
                "Battery",
                "Lead Wire",
                "Header"
            ],
            answer: 1
        },
        {
            question: "How does the pacemaker deliver electrical pulses to the heart tissue?",
            options: [
                "Through Lead Wires to the Electrode Tip",
                "Via the Antenna directly",
                "Through the Header into the bloodstream",
                "Using the Programmer Interface"
            ],
            answer: 0
        },
        {
            question: "What role does the Programmer Interface play?",
            options: [
                "Allows doctors to adjust pacemaker settings remotely",
                "Recharges the battery",
                "Directly stimulates the heart muscle",
                "Acts as a backup power source"
            ],
            answer: 0
        },
        {
            question: "What is the main purpose of the Circuitry inside the pacemaker?",
            options: [
                "To store blood",
                "To replace the battery",
                "To monitor heart rhythm and control pulse timing",
                "To connect the lead wires to the casing"
            ],
            answer: 2
        },
        {
            question: "Why is the Antenna included in modern pacemakers?",
            options: [
                "To capture radio waves for power",
                "To measure body temperature",
                "To transmit electrical shocks to the heart",
                "For telemetry and communication with external diagnostic devices"
            ],
            answer: 3
        }
    ];

    return group;
}
