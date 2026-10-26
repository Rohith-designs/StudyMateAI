import pdfParse from 'pdf-parse';

export const pdfService = {
  /**
   * Extract plain text and metadata from a PDF buffer
   * @param {Buffer} dataBuffer
   * @returns {Promise<{text: string, numpages: number, info: object}>}
   */
  async extractText(dataBuffer) {
    if (!dataBuffer || dataBuffer.length === 0) {
      throw new Error('PDF buffer is empty or missing.');
    }

    try {
      const data = await pdfParse(dataBuffer, {
        // Limit max pages to 100 for safety in MVP
        max: 100
      });

      const cleanedText = (data.text || '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n\s*\n+/g, '\n\n')
        .trim();

      return {
        text: cleanedText,
        pageCount: data.numpages || 1,
        info: data.info || {},
        version: data.version
      };
    } catch (err) {
      console.error('[pdfService] Error parsing PDF:', err);
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  }
};
