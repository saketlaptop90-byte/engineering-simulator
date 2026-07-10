export function createDialysisMachine(THREE) {
    const machineGroup = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const clearMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, transparent: true, opacity: 0.7 });
    const bloodMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const dialysateMat = new THREE.MeshStandardMaterial({ color: 0x44cc44 });
    const heparinMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const redMonitorMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const blueMonitorMat = new THREE.MeshStandardMaterial({ color: 0x2222aa });

    // 1. Dialysate Proportioning System (Main Body)
    const bodyGeo = new THREE.BoxGeometry(2, 4, 2);
    const mainBody = new THREE.Mesh(bodyGeo, bodyMat);
    mainBody.position.set(0, 2, 0);
    machineGroup.add(mainBody);

    // 2. Display Screen
    const screenGeo = new THREE.BoxGeometry(1.8, 1.2, 0.2);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 4.2, 0.5);
    screen.rotation.x = -Math.PI / 8;
    machineGroup.add(screen);

    // 3. Blood Pump
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const bloodPump = new THREE.Mesh(pumpGeo, metalMat);
    bloodPump.rotation.x = Math.PI / 2;
    bloodPump.position.set(-0.5, 3.0, 1.15);
    
    // Add visual marker to see rotation
    const pumpMarkerGeo = new THREE.BoxGeometry(0.8, 0.1, 0.35);
    const pumpMarker = new THREE.Mesh(pumpMarkerGeo, bloodMat);
    bloodPump.add(pumpMarker);
    machineGroup.add(bloodPump);

    // 4. Dialyzer
    const dialyzerGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const dialyzer = new THREE.Mesh(dialyzerGeo, clearMat);
    dialyzer.position.set(1.2, 2.5, 0.8);
    machineGroup.add(dialyzer);

    // 5. Dialysate Pump
    const dPumpGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const dialysatePump = new THREE.Mesh(dPumpGeo, dialysateMat);
    dialysatePump.rotation.x = Math.PI / 2;
    dialysatePump.position.set(0.5, 1.0, 1.1);
    
    const dPumpMarkerGeo = new THREE.BoxGeometry(0.6, 0.1, 0.45);
    const dPumpMarker = new THREE.Mesh(dPumpMarkerGeo, metalMat);
    dialysatePump.add(dPumpMarker);
    machineGroup.add(dialysatePump);

    // 6. Heparin Pump
    const heparinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
    const heparinPump = new THREE.Mesh(heparinGeo, heparinMat);
    heparinPump.position.set(-1.0, 2.2, 1.1);
    heparinPump.rotation.z = Math.PI / 4;
    machineGroup.add(heparinPump);

    // 7. Venous Bubble Trap
    const trapGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
    const bubbleTrap = new THREE.Mesh(trapGeo, clearMat);
    bubbleTrap.position.set(-0.5, 1.5, 1.2);
    machineGroup.add(bubbleTrap);

    // 8. Arterial Pressure Monitor
    const artMonitorGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const artMonitor = new THREE.Mesh(artMonitorGeo, redMonitorMat);
    artMonitor.position.set(-0.8, 3.6, 1.05);
    machineGroup.add(artMonitor);

    // 9. Venous Pressure Monitor
    const venMonitorGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const venMonitor = new THREE.Mesh(venMonitorGeo, blueMonitorMat);
    venMonitor.position.set(-0.3, 3.6, 1.05);
    machineGroup.add(venMonitor);

    // 10. Blood Lines
    const linesGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 24);
    const bloodLines = new THREE.Mesh(linesGeo, bloodMat);
    bloodLines.position.set(0.3, 2.8, 1.1);
    machineGroup.add(bloodLines);

    // Animation function
    machineGroup.userData.update = (time) => {
        // Rotate the blood pump and dialysate pump
        bloodPump.rotation.y = time * 2;
        dialysatePump.rotation.y = time * 1.5;
    };

    // Quiz Questions
    machineGroup.userData.quiz = [
        {
            question: "What is the function of the Blood Pump?",
            options: [
                "Mixes water and dialysate", 
                "Pumps blood from patient to the dialyzer", 
                "Filters waste from the blood", 
                "Removes air bubbles"
            ],
            answer: 1
        },
        {
            question: "What is the purpose of the Dialyzer?",
            options: [
                "Acts as an artificial kidney to filter waste", 
                "Prevents blood clotting", 
                "Pumps blood through the machine", 
                "Monitors blood pressure"
            ],
            answer: 0
        },
        {
            question: "Why is a Heparin Pump used in hemodialysis?",
            options: [
                "To heat the blood", 
                "To add oxygen to the blood", 
                "To continuously deliver anticoagulant to prevent clotting", 
                "To extract water from dialysate"
            ],
            answer: 2
        },
        {
            question: "What does the Venous Bubble Trap do?",
            options: [
                "Catches air bubbles before blood returns to the patient", 
                "Monitors arterial pressure", 
                "Mixes dialysate", 
                "Pumps heparin"
            ],
            answer: 0
        },
        {
            question: "What is the role of the Dialysate Proportioning System?",
            options: [
                "Displays the treatment time", 
                "Mixes purified water with dialysate concentrates", 
                "Filters red blood cells", 
                "Maintains the patient's heart rate"
            ],
            answer: 1
        },
        {
            question: "Why monitor Arterial and Venous Pressure?",
            options: [
                "To control the screen brightness", 
                "To measure the patient's temperature", 
                "To detect blockages, disconnections, or flow problems", 
                "To dispense heparin accurately"
            ],
            answer: 2
        }
    ];

    return machineGroup;
}
