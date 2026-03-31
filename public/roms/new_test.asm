.segment "HEADER"
.byte "NES", $1A  
.byte 1           
.byte 1
.byte %00000001
.byte 0
.byte 0, 0, 0, 0, 0, 0, 0, 0

.segment "CODE"

.org $8000 


lda_test:
    SEI         ; Disable interrupts
    CLD         ; Clear decimal mode
    LDX #$FF
    TXS         ; Set up stack

    LDA #$00    ; Initialize test memory area
    STA $0200
    STA $0201
    STA $0202
    STA $0203
    STA $0204

; --- Test LDA Immediate ---
    LDA #$42    ; Load immediate value
    STA $0200   ; Store result in RAM

; --- Test LDA Zero Page ---
    LDA #$55    
    STA $10      ; Store at zero page address
    LDA $10      ; Load from zero page
    STA $0201    ; Store result in RAM

; --- Test LDA Absolute ---
    LDA #$77
    STA $0300   ; Store at absolute address
    LDA $0300   ; Load from absolute
    STA $0202   ; Store result in RAM

; --- Test LDA Indexed ---
    LDX #$04
    LDA #$99
    STA $0200,X ; Store at indexed location
    LDA $01FC,X ; Load with indexed offset
    STA $0203   ; Store result in RAM

; --- Test LDA Indirect Indexed ---
    LDA #$02
    STA $00
    LDA #$00
    STA $01
    LDA #$AA
    STA ($00),Y ; Store at indirect address
    LDA ($00),Y ; Load from indirect address
    STA $0204   ; Store result in RAM

    BRK         ; Stop execution


.segment "VECTORS"
.org $FFFA
.word 0       ; NMI
.word lda_test; Reset Vector
.word 0       ; IRQ
