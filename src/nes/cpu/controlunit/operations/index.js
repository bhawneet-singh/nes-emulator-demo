import { ADC } from "./adc.js"
import { AND } from "./and.js"
import { ASL } from "./asl.js"
import { BIT } from "./bit.js"
import { Branch } from "./branch.js"
import { CMP } from "./cmp.js"
import { CPX } from "./cpx.js"
import { CPY } from "./cpy.js"
import { DEC } from "./dec.js"
import { EOR } from "./eor.js"
import { Flags } from "./flags.js"
import { INC } from "./inc.js"
import { JMP } from "./jmp.js"
import { LDA } from "./lda.js"
import { LDX } from "./ldx.js"
import { LDY } from "./ldy.js"
import { LSR } from "./lsr.js"
import { ORA } from "./ora.js"
import { ROL } from "./rol.js"
import { ROR } from "./ror.js"
import { SBC } from "./sbc.js"
import { STA } from "./sta.js"
import { Stack } from "./stack.js"
import { STX } from "./stx.js"
import { STY } from "./sty.js"
import { Transfer } from "./transfer.js"


class Operations {
  constructor({ cpu }) {
    this.cpu = cpu
    this.lda = new LDA({ cpu })
    this.ldx = new LDX({ cpu })
    this.ldy = new LDY({ cpu })
    this.and = new AND({ cpu })
    this.asl = new ASL({ cpu })
    this.lsr = new LSR({ cpu })
    this.cmp = new CMP({ cpu })
    this.cpy = new CPY({ cpu })
    this.cpx = new CPX({ cpu })
    this.dec = new DEC({ cpu })
    this.inc = new INC({ cpu })
    this.eor = new EOR({ cpu })
    this.jmp = new JMP({ cpu })
    this.ora = new ORA({ cpu })
    this.sta = new STA({ cpu })
    this.stx = new STX({ cpu })
    this.sty = new STY({ cpu })
    this.adc = new ADC({ cpu })
    this.sbc = new SBC({ cpu })
    this.rol = new ROL({ cpu })
    this.ror = new ROR({ cpu })
    this.bit = new BIT({ cpu })

    this.branch = new Branch({ cpu })
    this.flags = new Flags({ cpu })
    this.transfer = new Transfer({ cpu })
    this.stack = new Stack({ cpu })
  }

  getOpcode() {
    const noimp = () => {
      console.log(this.cpu, this.cpu.programCounter.toString("16"));
      postMessage({ type: "ram", data: { ram: this.cpu.bus.ram } })
      throw Error("Instruction not Implementated")
    }
    return {
      LOG_TST: { name: "???", type: "implied", cycles: 1, length: 1, exec: () => console.log("no instruction") },
      //ADC
      ADC_IMM: { name: "ADC", type: "immediate", cycles: 2, length: 2, exec: this.adc.immediate },
      ADC_ZRO: { name: "ADC", type: "zeropage", cycles: 3, length: 2, exec: this.adc.zeropage },
      ADC_ZPX: { name: "ADC", type: "zeropage,x", cycles: 4, length: 2, exec: this.adc.zeropagex },
      ADC_ABS: { name: "ADC", type: "absolute", cycles: 4, length: 3, exec: this.adc.absolute },
      ADC_ABX: { name: "ADC", type: "absolute,x", cycles: 4, length: 3, exec: this.adc.absolutex },
      ADC_ABY: { name: "ADC", type: "absolute,y", cycles: 4, length: 3, exec: this.adc.absolutey },
      ADC_IDX: { name: "ADC", type: "indirect,x", cycles: 6, length: 2, exec: this.adc.indirectx },
      ADC_IDY: { name: "ADC", type: "indirect,y", cycles: 5, length: 2, exec: this.adc.indirecty },

      //AND
      AND_IMM: { name: "AND", type: "immediate", cycles: 2, length: 2, exec: this.and.immediate },
      AND_ZRO: { name: "AND", type: "zeropage", cycles: 3, length: 2, exec: this.and.zeropage },
      AND_ZPX: { name: "AND", type: "zeropage,x", cycles: 4, length: 2, exec: this.and.zeropagex },
      AND_ABS: { name: "AND", type: "absolute", cycles: 4, length: 3, exec: this.and.absolute },
      AND_ABX: { name: "AND", type: "absolute,x", cycles: 4, length: 3, exec: this.and.absolutex },
      AND_ABY: { name: "AND", type: "absolute,y", cycles: 4, length: 3, exec: this.and.absolutey },
      AND_IDX: { name: "AND", type: "indirect,x", cycles: 6, length: 2, exec: this.and.indirectx },
      AND_IDY: { name: "AND", type: "indirect,y", cycles: 5, length: 2, exec: this.and.indirecty },

      //ASL
      ASL_ACC: { name: "ASL", type: "accumulator", cycles: 2, length: 1, exec: this.asl.accumulator },
      ASL_ZRO: { name: "ASL", type: "zeropage", cycles: 5, length: 2, exec: this.asl.zeropage },
      ASL_ZPX: { name: "ASL", type: "zeropage,x", cycles: 6, length: 2, exec: this.asl.zeropagex },
      ASL_ABS: { name: "ASL", type: "absolute", cycles: 6, length: 3, exec: this.asl.absolute },
      ASL_ABX: { name: "ASL", type: "absolute,x", cycles: 7, length: 3, exec: this.asl.absolutex },

      //BCC
      BCC_REL: { name: "BCC", type: "relative", cycles: 2, length: 2, exec: this.branch.bcc },

      //BCS
      BCS_REL: { name: "BCS", type: "relative", cycles: 2, length: 2, exec: this.branch.bcs },

      //BEQ
      BEQ_REL: { name: "BEQ", type: "relative", cycles: 2, length: 2, exec: this.branch.beq },

      //BIT
      BIT_ZRO: { name: "BIT", type: "zeropage", cycles: 3, length: 2, exec: this.bit.zeropage },
      BIT_ABS: { name: "BIT", type: "absolute", cycles: 4, length: 3, exec: this.bit.absolute },

      //BEQ
      BMI_REL: { name: "BMI", type: "relative", cycles: 2, length: 2, exec: this.branch.bmi },

      //BEQ
      BNE_REL: { name: "BNE", type: "relative", cycles: 2, length: 2, exec: this.branch.bne },

      //BPL
      BPL_REL: { name: "BPL", type: "relative", cycles: 2, length: 2, exec: this.branch.bpl },

      //BRK
      BRK_IMP: { name: "BRK", type: "implied", cycles: 7, length: 1, exec: noimp },

      //BVC
      BVC_REL: { name: "BVC", type: "relative", cycles: 2, length: 2, exec: this.branch.bvc },

      //BVS
      BVS_REL: { name: "BVS", type: "relative", cycles: 2, length: 2, exec: this.branch.bvs },

      //CLC
      CLC_IMP: { name: "CLC", type: "implied", cycles: 2, length: 1, exec: this.flags.clc },

      //CLI
      CLI_IMP: { name: "CLI", type: "implied", cycles: 2, length: 1, exec: this.flags.cli },

      //CLV
      CLV_IMP: { name: "CLV", type: "implied", cycles: 2, length: 1, exec: this.flags.clv },

      //CLD
      CLD_IMP: { name: "CLD", type: "implied", cycles: 2, length: 1, exec: this.flags.cld },

      //CMP
      CMP_IMM: { name: "CMP", type: "immediate", cycles: 2, length: 2, exec: this.cmp.immediate },
      CMP_ZRO: { name: "CMP", type: "zeropage", cycles: 3, length: 2, exec: this.cmp.zeropage },
      CMP_ZPX: { name: "CMP", type: "zeropage,x", cycles: 4, length: 2, exec: this.cmp.zeropagex },
      CMP_ABS: { name: "CMP", type: "absolute", cycles: 4, length: 3, exec: this.cmp.absolute },
      CMP_ABX: { name: "CMP", type: "absolute,x", cycles: 4, length: 3, exec: this.cmp.absolutex },
      CMP_ABY: { name: "CMP", type: "absolute,y", cycles: 4, length: 3, exec: this.cmp.absolutey },
      CMP_IDX: { name: "CMP", type: "indirect,x", cycles: 6, length: 2, exec: this.cmp.indirectx },
      CMP_IDY: { name: "CMP", type: "indirect,y", cycles: 5, length: 2, exec: this.cmp.indirecty },

      //CPX
      CPX_IMM: { name: "CPX", type: "immediate", cycles: 2, length: 2, exec: this.cpx.immediate },
      CPX_ZRO: { name: "CPX", type: "zeropage", cycles: 3, length: 2, exec: this.cpx.zeropage },
      CPX_ABS: { name: "CPX", type: "absolute", cycles: 4, length: 3, exec: this.cpx.absolute },

      //CPY
      CPY_IMM: { name: "CPY", type: "immediate", cycles: 2, length: 2, exec: this.cpy.immediate },
      CPY_ZRO: { name: "CPY", type: "zeropage", cycles: 3, length: 2, exec: this.cpy.zeropage },
      CPY_ABS: { name: "CPY", type: "absolute", cycles: 4, length: 3, exec: this.cpy.absolute },

      //DEC
      DEC_ZRO: { name: "DEC", type: "zeropage", cycles: 5, length: 2, exec: this.dec.zeropage },
      DEC_ZPX: { name: "DEC", type: "zeropage,x", cycles: 6, length: 2, exec: this.dec.zeropagex },
      DEC_ABS: { name: "DEC", type: "absolute", cycles: 6, length: 3, exec: this.dec.absolute },
      DEC_ABX: { name: "DEC", type: "absolute,x", cycles: 7, length: 3, exec: this.dec.absolutex },

      //DEX
      DEX_IMP: { name: "DEX", type: "implied", cycles: 2, length: 1, exec: this.dec.dex },

      //DEY
      DEY_IMP: { name: "DEY", type: "implied", cycles: 2, length: 1, exec: this.dec.dey },

      //EOR
      EOR_IMM: { name: "EOR", type: "immediate", cycles: 2, length: 2, exec: this.eor.immediate },
      EOR_ZRO: { name: "EOR", type: "zeropage", cycles: 3, length: 2, exec: this.eor.zeropage },
      EOR_ZPX: { name: "EOR", type: "zeropage,x", cycles: 4, length: 2, exec: this.eor.zeropagex },
      EOR_ABS: { name: "EOR", type: "absolute", cycles: 4, length: 3, exec: this.eor.absolute },
      EOR_ABX: { name: "EOR", type: "absolute,x", cycles: 4, length: 3, exec: this.eor.absolutex },
      EOR_ABY: { name: "EOR", type: "absolute,y", cycles: 4, length: 3, exec: this.eor.absolutey },
      EOR_INX: { name: "EOR", type: "indirect,x", cycles: 6, length: 2, exec: this.eor.indirectx },
      EOR_INY: { name: "EOR", type: "indirect,y", cycles: 5, length: 2, exec: this.eor.indirecty },

      //INC
      INC_ZRO: { name: "INC", type: "zeropage", cycles: 5, length: 2, exec: this.inc.zeropage },
      INC_ZPX: { name: "INC", type: "zeropage,x", cycles: 6, length: 2, exec: this.inc.zeropagex },
      INC_ABS: { name: "INC", type: "absolute", cycles: 6, length: 3, exec: this.inc.absolute },
      INC_ABX: { name: "INC", type: "absolute,x", cycles: 7, length: 3, exec: this.inc.absolutex },

      //INX
      INX_IMP: { name: "INX", type: "implied", cycles: 2, length: 1, exec: this.inc.inx },

      //INY
      INY_IMP: { name: "INX", type: "implied", cycles: 2, length: 1, exec: this.inc.iny },

      //JMP
      JMP_ABS: { name: "JMP", type: "absolute", cycles: 3, length: 3, exec: this.jmp.absolute },
      JMP_IND: { name: "JMP", type: "indirect", cycles: 5, length: 3, exec: this.jmp.indirect },

      //JSR
      JSR_ABS: { name: "JSR", type: "absolute", cycles: 6, length: 3, exec: this.stack.jsr },

      //LDA
      LDA_IMM: { name: "LDA", type: "immediate", cycles: 2, length: 2, exec: this.lda.immediate },
      LDA_ZRO: { name: "LDA", type: "zeropage", cycles: 3, length: 2, exec: this.lda.zeropage },
      LDA_ZPX: { name: "LDA", type: "zeropage,x", cycles: 4, length: 2, exec: this.lda.zeropagex },
      LDA_ABS: { name: "LDA", type: "absolute", cycles: 4, length: 3, exec: this.lda.absolute },
      LDA_ABX: { name: "LDA", type: "absolute,x", cycles: 4, length: 3, exec: this.lda.absolutex },
      LDA_ABY: { name: "LDA", type: "absolute,y", cycles: 4, length: 3, exec: this.lda.absolutey },
      LDA_IDX: { name: "LDA", type: "indirect,x", cycles: 6, length: 2, exec: this.lda.indirectx },
      LDA_IDY: { name: "LDA", type: "indirect,y", cycles: 5, length: 2, exec: this.lda.indirecty },

      //LDX
      LDX_IMM: { name: "LDX", type: "immediate", cycles: 2, length: 2, exec: this.ldx.immediate },
      LDX_ZRO: { name: "LDX", type: "zeropage", cycles: 3, length: 2, exec: this.ldx.zeropage },
      LDX_ZPY: { name: "LDX", type: "zeropage,y", cycles: 4, length: 2, exec: this.ldx.zeropagey },
      LDX_ABS: { name: "LDX", type: "absolute", cycles: 4, length: 3, exec: this.ldx.absolute },
      LDX_ABY: { name: "LDX", type: "absolute,y", cycles: 4, length: 3, exec: this.ldx.absolutey },

      //LDY
      LDY_IMM: { name: "LDY", type: "immediate", cycles: 2, length: 2, exec: this.ldy.immediate },
      LDY_ZRO: { name: "LDY", type: "zeropage", cycles: 3, length: 2, exec: this.ldy.zeropage },
      LDY_ZPX: { name: "LDY", type: "zeropage,x", cycles: 4, length: 2, exec: this.ldy.zeropagex },
      LDY_ABS: { name: "LDY", type: "absolute", cycles: 4, length: 3, exec: this.ldy.absolute },
      LDY_ABX: { name: "LDY", type: "absolute,x", cycles: 4, length: 3, exec: this.ldy.absolutex },

      //LSR
      LSR_ACC: { name: "LSR", type: "accumulator", cycles: 2, length: 1, exec: this.lsr.accumulator },
      LSR_ZRO: { name: "LSR", type: "zeropage", cycles: 5, length: 2, exec: this.lsr.zeropage },
      LSR_ZPX: { name: "LSR", type: "zeropage,x", cycles: 6, length: 2, exec: this.lsr.zeropagex },
      LSR_ABS: { name: "LSR", type: "absolute", cycles: 6, length: 3, exec: this.lsr.absolute },
      LSR_ABX: { name: "LSR", type: "absolute,x", cycles: 7, length: 3, exec: this.lsr.absolutex },

      //NOP
      NOP_IMP: { name: "NOP", type: "implied", cycles: 2, length: 1, exec: () => { } },

      //ORA
      ORA_IMM: { name: "ORA", type: "immediate", cycles: 2, length: 2, exec: this.ora.immediate },
      ORA_ZRO: { name: "ORA", type: "zeropage", cycles: 3, length: 2, exec: this.ora.zeropage },
      ORA_ZPX: { name: "ORA", type: "zeropage,x", cycles: 4, length: 2, exec: this.ora.zeropagex },
      ORA_ABS: { name: "ORA", type: "absolute", cycles: 4, length: 3, exec: this.ora.absolute },
      ORA_ABX: { name: "ORA", type: "absolute,x", cycles: 4, length: 3, exec: this.ora.absolutex },
      ORA_ABY: { name: "ORA", type: "absolute,y", cycles: 4, length: 3, exec: this.ora.absolutey },
      ORA_IDX: { name: "ORA", type: "indirect,x", cycles: 6, length: 2, exec: this.ora.indirectx },
      ORA_IDY: { name: "ORA", type: "indirect,y", cycles: 5, length: 2, exec: this.ora.indirecty },

      //PHA
      PHA_IMP: { name: "PHA", type: "implied", cycles: 3, length: 1, exec: this.stack.pha },

      //PHP
      PHP_IMP: { name: "PHP", type: "implied", cycles: 3, length: 1, exec: this.stack.php },

      //PHP
      PLA_IMP: { name: "PLA", type: "implied", cycles: 4, length: 1, exec: this.stack.pla },

      //PHP
      PLP_IMP: { name: "PLP", type: "implied", cycles: 4, length: 1, exec: this.stack.plp },

      //ROL
      ROL_ACC: { name: "ROL", type: "accumulator", cycles: 2, length: 1, exec: this.rol.accumulator },
      ROL_ZRO: { name: "ROL", type: "zeropage", cycles: 5, length: 2, exec: this.rol.zeropage },
      ROL_ZPX: { name: "ROL", type: "zeropage,x", cycles: 6, length: 2, exec: this.rol.zeropagex },
      ROL_ABS: { name: "ROL", type: "absolute", cycles: 6, length: 3, exec: this.rol.absolute },
      ROL_ABX: { name: "ROL", type: "absolute,x", cycles: 7, length: 3, exec: this.rol.absolutex },

      //ROR
      ROR_ACC: { name: "ROR", type: "accumulator", cycles: 2, length: 1, exec: this.ror.accumulator },
      ROR_ZRO: { name: "ROR", type: "zeropage", cycles: 5, length: 2, exec: this.ror.zeropage },
      ROR_ZPX: { name: "ROR", type: "zeropage,x", cycles: 6, length: 2, exec: this.ror.zeropagex },
      ROR_ABS: { name: "ROR", type: "absolute", cycles: 6, length: 3, exec: this.ror.absolute },
      ROR_ABX: { name: "ROR", type: "absolute,x", cycles: 7, length: 3, exec: this.ror.absolutex },

      //RTI
      RTI_IMP: { name: "RTI", type: "implied", cycles: 6, length: 1, exec: this.stack.rti },

      //RTS
      RTS_IMP: { name: "RTS", type: "implied", cycles: 6, length: 1, exec: this.stack.rts },

      //SBC
      SBC_IMM: { name: "SBC", type: "immediate", cycles: 2, length: 2, exec: this.sbc.immediate },
      SBC_ZRO: { name: "SBC", type: "zeropage", cycles: 3, length: 2, exec: this.sbc.zeropage },
      SBC_ZPX: { name: "SBC", type: "zeropage,x", cycles: 4, length: 2, exec: this.sbc.zeropagex },
      SBC_ABS: { name: "SBC", type: "absolute", cycles: 4, length: 3, exec: this.sbc.absolute },
      SBC_ABX: { name: "SBC", type: "absolute,x", cycles: 4, length: 3, exec: this.sbc.absolutex },
      SBC_ABY: { name: "SBC", type: "absolute,y", cycles: 4, length: 3, exec: this.sbc.absolutey },
      SBC_IDX: { name: "SBC", type: "indirect,x", cycles: 6, length: 2, exec: this.sbc.indirectx },
      SBC_IDY: { name: "SBC", type: "indirect,y", cycles: 5, length: 2, exec: this.sbc.indirecty },

      //SEC
      SEC_IMP: { name: "SEC", type: "implied", cycles: 2, length: 1, exec: this.flags.sec },

      //SED
      SED_IMP: { name: "SED", type: "implied", cycles: 2, length: 1, exec: this.flags.sed },

      //SEI
      SEI_IMP: { name: "SEI", type: "implied", cycles: 2, length: 1, exec: this.flags.sei },

      //STA
      STA_ZRO: { name: "STA", type: "zeropage", cycles: 3, length: 2, exec: this.sta.zeropage },
      STA_ZPX: { name: "STA", type: "zeropage,x", cycles: 4, length: 2, exec: this.sta.zeropagex },
      STA_ABS: { name: "STA", type: "absolute", cycles: 4, length: 3, exec: this.sta.absolute },
      STA_ABX: { name: "STA", type: "absolute,x", cycles: 5, length: 3, exec: this.sta.absolutex },
      STA_ABY: { name: "STA", type: "absolute,y", cycles: 5, length: 3, exec: this.sta.absolutey },
      STA_INX: { name: "STA", type: "indirect,x", cycles: 6, length: 2, exec: this.sta.indirectx },
      STA_INY: { name: "STA", type: "indirect,y", cycles: 6, length: 2, exec: this.sta.indirecty },

      //STX
      STX_ZRO: { name: "STX", type: "zeropage", cycles: 3, length: 2, exec: this.stx.zeropage },
      STX_ZRY: { name: "STX", type: "zeropage,y", cycles: 4, length: 2, exec: this.stx.zeropagey },
      STX_ABS: { name: "STX", type: "absolute", cycles: 4, length: 3, exec: this.stx.absolute },

      //STY
      STY_ZRO: { name: "STY", type: "zeropage", cycles: 3, length: 2, exec: this.sty.zeropage },
      STY_ZPX: { name: "STY", type: "zeropage,x", cycles: 4, length: 2, exec: this.sty.zeropagex },
      STY_ABS: { name: "STY", type: "absolute", cycles: 4, length: 3, exec: this.sty.absolute },

      //TAX
      TAX_IMP: { name: "TAX", type: "implied", cycles: 2, length: 1, exec: this.transfer.tax },

      //TAY
      TAY_IMP: { name: "TAY", type: "implied", cycles: 2, length: 1, exec: this.transfer.tay },

      //TSX
      TSX_IMP: { name: "TSX", type: "implied", cycles: 2, length: 1, exec: this.transfer.tsx },

      //TXA
      TXA_IMP: { name: "TXA", type: "implied", cycles: 2, length: 1, exec: this.transfer.txa },

      //TXS
      TXS_IMP: { name: "TXS", type: "implied", cycles: 2, length: 1, exec: this.transfer.txs },

      //TYA
      TYA_IMP: { name: "TYA", type: "implied", cycles: 2, length: 1, exec: this.transfer.tya },
    }
  }
}

export { Operations }
