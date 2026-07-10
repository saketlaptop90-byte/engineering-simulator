import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Thermal Cycler Block (Background/Environment)
    const blockGeom = new THREE.CylinderGeometry(8, 8, 4, 32);
    const blockMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const block = new THREE.Mesh(blockGeom, blockMat);
    block.position.set(0, -6, 0);
    group.add(block);
    
    // Tube wall (transparent)
    const tubeGeom = new THREE.CylinderGeometry(6, 6, 12, 32, 1, true);
    const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    tube.position.set(0, 0, 0);
    group.add(tube);

    // Environment Color (Temperature indicator)
    const envGeom = new THREE.CylinderGeometry(5.8, 5.8, 11.8, 32);
    const envMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
    const env = new THREE.Mesh(envGeom, envMat);
    group.add(env);

    const dnaGroup = new THREE.Group();
    group.add(dnaGroup);

    // DNA creation helper
    const bbGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const rungGeom = new THREE.CylinderGeometry(0.08, 0.08, 1, 8);
    rungGeom.rotateZ(Math.PI/2);
    rungGeom.translate(0.5, 0, 0);

    const bbMatStrand1 = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const bbMatStrand2 = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const bbMatPrimer1 = new THREE.MeshStandardMaterial({ color: 0xff00ff }); // Magenta primers
    const bbMatPrimer2 = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Cyan primers
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // simplified bases

    function createDNAStrand(length, isTop, isPrimer) {
        const strand = new THREE.Group();
        const mat = isPrimer ? (isTop ? bbMatPrimer1 : bbMatPrimer2) : (isTop ? bbMatStrand1 : bbMatStrand2);
        
        for(let i=0; i<length; i++) {
            const bp = new THREE.Group();
            bp.position.x = (i - length/2) * 0.6;
            
            const bb = new THREE.Mesh(bbGeom, mat);
            bb.position.y = isTop ? 0.5 : -0.5;
            bp.add(bb);
            
            const rung = new THREE.Mesh(rungGeom, baseMat);
            rung.position.y = isTop ? 0.5 : -0.5;
            if(!isTop) rung.rotation.z = Math.PI; // point up
            bp.add(rung);
            
            strand.add(bp);
        }
        return strand;
    }

    // State
    const cycles = 3;
    let currentCycle = 1;
    let phase = 0; // 0=Denaturation(95C), 1=Annealing(55C), 2=Extension(72C)
    let phaseTimer = 0;
    
    // Initial DNA
    const dnas = [];
    
    const initDNA = () => {
        const dna = new THREE.Group();
        const s1 = createDNAStrand(16, true, false);
        const s2 = createDNAStrand(16, false, false);
        dna.add(s1);
        dna.add(s2);
        dna.userData = { s1, s2, state: 'double' }; // states: double, split, annealed, extending
        dnaGroup.add(dna);
        dnas.push(dna);
    };
    initDNA();

    // Floating Nucleotides (dNTPs) & Taq
    const dNtpGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const pGroup = new THREE.Group();
    group.add(pGroup);
    for(let i=0; i<50; i++) {
        const m = new THREE.Mesh(dNtpGeom, baseMat);
        m.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
        m.userData = { 
            vel: new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2),
            rot: new THREE.Vector3(Math.random(), Math.random(), Math.random())
        };
        pGroup.add(m);
    }

    const createMeter = (title, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const tex = new THREE.CanvasTexture(canvas);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        plane.position.copy(pos);
        group.add(plane);
        return { canvas, ctx, tex, title };
    };

    const display = createMeter("PCR Status", new THREE.Vector3(0, 8, 0));

    const updateDisplay = (temp, phaseName, color) => {
        display.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        display.ctx.fillRect(0,0,256,128);
        display.ctx.strokeStyle = color;
        display.ctx.lineWidth = 4;
        display.ctx.strokeRect(0,0,256,128);
        
        display.ctx.fillStyle = 'white';
        display.ctx.font = '20px Arial';
        display.ctx.textAlign = 'center';
        display.ctx.fillText(`Cycle ${currentCycle} / ${cycles}`, 128, 30);
        
        display.ctx.fillStyle = color;
        display.ctx.font = 'bold 36px Arial';
        display.ctx.fillText(phaseName, 128, 75);
        
        display.ctx.fillStyle = 'white';
        display.ctx.font = '24px monospace';
        display.ctx.fillText(`${temp} °C`, 128, 110);
        
        display.tex.needsUpdate = true;
    };

    group.userData.animate = (delta) => {
        phaseTimer += delta;

        // DNA floating motion
        dnas.forEach((dna, idx) => {
            dna.position.y = Math.sin(Date.now() * 0.002 + idx) * 0.5;
            dna.rotation.y += delta * 0.2;
        });
        
        // Particles moving
        pGroup.children.forEach(p => {
            p.position.addScaledVector(p.userData.vel, delta * (phase === 0 ? 3 : 1)); // Faster at high temp
            p.rotation.x += p.userData.rot.x * delta;
            p.rotation.y += p.userData.rot.y * delta;
            
            // bounce
            if(p.position.lengthSq() > 25) {
                p.userData.vel.multiplyScalar(-1);
            }
        });

        const phaseDur = 4; // seconds per phase

        if (phase === 0) {
            // Denaturation (95C)
            envMat.color.setHex(0xff3300); // Red hot
            envMat.opacity = 0.2 + (Math.sin(phaseTimer*10)*0.05);
            updateDisplay(95, "Denaturation", "#ff3300");
            
            dnas.forEach(dna => {
                if(dna.userData.state === 'double') {
                    // Split
                    dna.userData.s1.position.y += delta;
                    dna.userData.s2.position.y -= delta;
                    if(dna.userData.s1.position.y > 1.5) {
                        dna.userData.s1.position.y = 1.5;
                        dna.userData.s2.position.y = -1.5;
                        dna.userData.state = 'split';
                    }
                }
            });
            
            if (phaseTimer >= phaseDur) {
                phase = 1; phaseTimer = 0;
            }
        } else if (phase === 1) {
            // Annealing (55C)
            envMat.color.setHex(0x00ccff); // Cool blue
            envMat.opacity = 0.1;
            updateDisplay(55, "Annealing", "#00ccff");
            
            dnas.forEach(dna => {
                if(dna.userData.state === 'split') {
                    // Add primers
                    if(!dna.userData.primer1) {
                        dna.userData.primer1 = createDNAStrand(4, false, true);
                        dna.userData.primer1.position.set(-3.6, 1.5, 0);
                        dna.add(dna.userData.primer1);
                        
                        dna.userData.primer2 = createDNAStrand(4, true, true);
                        dna.userData.primer2.position.set(3.6, -1.5, 0);
                        dna.add(dna.userData.primer2);
                    }
                    // Fade in primers
                    dna.userData.primer1.scale.setScalar(Math.min(1, phaseTimer));
                    dna.userData.primer2.scale.setScalar(Math.min(1, phaseTimer));
                    
                    if(phaseTimer > 1) dna.userData.state = 'annealed';
                }
            });
            
            if (phaseTimer >= phaseDur) {
                phase = 2; phaseTimer = 0;
            }
        } else if (phase === 2) {
            // Extension (72C)
            envMat.color.setHex(0x00ff00); // Optimal green
            envMat.opacity = 0.15;
            updateDisplay(72, "Extension", "#00ff00");
            
            dnas.forEach(dna => {
                if(dna.userData.state === 'annealed') {
                    dna.userData.extP = 4; // Start at length 4
                    dna.userData.state = 'extending';
                } else if (dna.userData.state === 'extending') {
                    dna.userData.extP += delta * 4; // build speed
                    
                    // Rebuild strands visual (just stretch primer)
                    if(dna.userData.primer1) {
                        dna.userData.primer1.scale.x = Math.min(16/4, dna.userData.extP/4);
                        dna.userData.primer1.position.x = -3.6 + ((dna.userData.primer1.scale.x - 1) * 1.2);
                        
                        dna.userData.primer2.scale.x = Math.min(16/4, dna.userData.extP/4);
                        dna.userData.primer2.position.x = 3.6 - ((dna.userData.primer2.scale.x - 1) * 1.2);
                    }
                    
                    if(dna.userData.extP >= 16) {
                        dna.userData.state = 'done';
                    }
                }
            });
            
            if (phaseTimer >= phaseDur) {
                // Next Cycle!
                const newDNAs = [];
                dnas.forEach(dna => {
                    if(dna.userData.state === 'done') {
                        // Split into two new double strands
                        const topDNA = new THREE.Group();
                        topDNA.position.copy(dna.position);
                        topDNA.position.y += 1;
                        topDNA.add(createDNAStrand(16, true, false));
                        topDNA.add(createDNAStrand(16, false, true)); // show primer
                        topDNA.userData = { s1: topDNA.children[0], s2: topDNA.children[1], state: 'double' };
                        
                        const botDNA = new THREE.Group();
                        botDNA.position.copy(dna.position);
                        botDNA.position.y -= 1;
                        botDNA.add(createDNAStrand(16, true, true)); // show primer
                        botDNA.add(createDNAStrand(16, false, false));
                        botDNA.userData = { s1: botDNA.children[0], s2: botDNA.children[1], state: 'double' };
                        
                        dnaGroup.remove(dna);
                        dnaGroup.add(topDNA);
                        dnaGroup.add(botDNA);
                        newDNAs.push(topDNA, botDNA);
                    }
                });
                
                dnas.length = 0;
                newDNAs.forEach(n => dnas.push(n));
                
                // Spread them out
                dnas.forEach((d, i) => {
                    d.position.x = (Math.random()-0.5)*8;
                    d.position.z = (Math.random()-0.5)*8;
                    d.position.y = (Math.random()-0.5)*6;
                });
                
                currentCycle++;
                phase = 0; 
                phaseTimer = 0;
                
                if (currentCycle > cycles) {
                    // Reset everything
                    currentCycle = 1;
                    while(dnaGroup.children.length > 0){ 
                        dnaGroup.remove(dnaGroup.children[0]); 
                    }
                    dnas.length = 0;
                    initDNA();
                }
            }
        }
    };

    return group;
}
