import { Operations } from "./operations/index.js"

class ControlUnit {
  constructor({ cpu }) {
    this.cpu = cpu
    this.operations = new Operations({cpu})
    const opc = this.operations.getOpcode()
    this.opcodes = this.cpu.opcodes = [
      //    0            1           2         3        4              5            6        7         8            9            a        b        c            d            e        f    
      [opc.BRK_IMP, opc.ORA_IDX,    null,     null,    null,     opc.ORA_ZRO, opc.ASL_ZRO, null, opc.PHP_IMP, opc.ORA_IMM, opc.ASL_ACC, null,    null,     opc.ORA_ABS, opc.ASL_ABS, null], // 0
      [opc.BPL_REL, opc.ORA_IDY,    null,     null,    null,     opc.ORA_ZPX, opc.ASL_ZPX, null, opc.CLC_IMP, opc.ORA_ABY,     null   , null,    null,     opc.ORA_ABX, opc.ASL_ABX, null], // 1
      [opc.JSR_ABS, opc.AND_IDX,    null,     null, opc.BIT_ZRO, opc.AND_ZRO, opc.ROL_ZRO, null, opc.PLP_IMP, opc.AND_IMM, opc.ROL_ACC, null, opc.BIT_ABS, opc.AND_ABS, opc.ROL_ABS, null], // 2
      [opc.BMI_REL, opc.AND_IDY,    null,     null,    null,     opc.AND_ZPX, opc.ROL_ZPX, null, opc.SEC_IMP, opc.AND_ABY,     null   , null,    null,     opc.AND_ABX, opc.ROL_ABX, null], // 3
      [opc.RTI_IMP, opc.EOR_INX,    null,     null,    null,     opc.EOR_ZRO, opc.LSR_ZRO, null, opc.PHA_IMP, opc.EOR_IMM, opc.LSR_ACC, null, opc.JMP_ABS, opc.EOR_ABS, opc.LSR_ABS, null], // 4
      [opc.BVC_REL, opc.EOR_INY,    null,     null,    null,     opc.EOR_ZPX, opc.LSR_ZPX, null, opc.CLI_IMP, opc.EOR_ABY,     null   , null,    null,     opc.EOR_ABX, opc.LSR_ABX, null], // 5
      [opc.RTS_IMP, opc.ADC_IDX,    null,     null,    null,     opc.ADC_ZRO, opc.ROR_ZRO, null, opc.PLA_IMP, opc.ADC_IMM, opc.ROR_ACC, null, opc.JMP_IND, opc.ADC_ABS, opc.ROR_ABS, null], // 6
      [opc.BVS_REL, opc.ADC_IDY,    null,     null,    null,     opc.ADC_ZPX, opc.ROR_ZPX, null, opc.SEI_IMP, opc.ADC_ABY,     null   , null,    null,     opc.ADC_ABX, opc.ROR_ABX, null], // 7
      [    null   , opc.STA_INX,    null,     null, opc.STY_ZRO, opc.STA_ZRO, opc.STX_ZRO, null, opc.DEY_IMP,     null   , opc.TXA_IMP, null, opc.STY_ABS, opc.STA_ABS, opc.STX_ABS, null], // 8
      [opc.BCC_REL, opc.STA_INY,    null,     null, opc.STY_ZPX, opc.STA_ZPX, opc.STX_ZRY, null, opc.TYA_IMP, opc.STA_ABY, opc.TXS_IMP, null,    null,     opc.STA_ABX,     null   , null], // 9
      [opc.LDY_IMM, opc.LDA_IDX, opc.LDX_IMM, null, opc.LDY_ZRO, opc.LDA_ZRO, opc.LDX_ZRO, null, opc.TAY_IMP, opc.LDA_IMM, opc.TAX_IMP, null, opc.LDY_ABS, opc.LDA_ABS, opc.LDX_ABS, null], // a
      [opc.BCS_REL, opc.LDA_IDY,    null,     null, opc.LDY_ZPX, opc.LDA_ZPX, opc.LDX_ZPY, null, opc.CLV_IMP, opc.LDA_ABY, opc.TSX_IMP, null, opc.LDY_ABX, opc.LDA_ABX, opc.LDX_ABY, null], // b
      [opc.CPY_IMM, opc.CMP_IDX,    null,     null, opc.CPY_ZRO, opc.CMP_ZRO, opc.DEC_ZRO, null, opc.INY_IMP, opc.CMP_IMM, opc.DEX_IMP, null, opc.CPY_ABS, opc.CMP_ABS, opc.DEC_ABS, null], // c
      [opc.BNE_REL, opc.CMP_IDY,    null,     null,    null,     opc.CMP_ZPX, opc.DEC_ZPX, null, opc.CLD_IMP, opc.CMP_ABY,     null   , null,    null,     opc.CMP_ABX, opc.DEC_ABX, null], // d
      [opc.CPX_IMM, opc.SBC_IDX,    null,     null, opc.CPX_ZRO, opc.SBC_ZRO, opc.INC_ZRO, null, opc.INX_IMP, opc.SBC_IMM, opc.NOP_IMP, null, opc.CPX_ABS, opc.SBC_ABS, opc.INC_ABS, null], // e
      [opc.BEQ_REL, opc.SBC_IDY,    null,     null,    null,     opc.SBC_ZPX, opc.INC_ZPX, null, opc.SED_IMP, opc.SBC_ABY,     null   , null,    null,     opc.SBC_ABX, opc.INC_ABX, null], // f
    ]
  }

  decode = () => {
    const opcode = this.cpu.register.instructionRegister
    this.operation = this.opcodes[opcode >>> 4][opcode & 0x0f]
  }

  execute = ()=> {
    if (this.operation)
      this.operation.exec({ cpu: this.cpu })
  }
}

export { ControlUnit }
