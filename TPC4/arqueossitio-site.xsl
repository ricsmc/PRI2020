<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <xsl:result-document href="arqweb/index.html">
    <html>
      <head>
        <title>Arqueossítios</title>
      </head>
      <body>

        <h3>Arqueossítios</h3>
              <ul>
                <xsl:apply-templates mode="indice" select="//ARQELEM">
                  <xsl:sort select="IDENTI" lang="PT"/>
                </xsl:apply-templates>
              </ul>
      </body>
    </html>
    </xsl:result-document>
    <xsl:apply-templates select="//ARQELEM" mode="paginas"> <!-- Travessia para gerar as páginas dos registos -->
      <xsl:sort select="IDENTI" lang="PT">
        
      </xsl:sort>
    </xsl:apply-templates> 
    
  </xsl:template>
  
  <!-- TEMPLATE PARA INDICE ....................................................-->
  <xsl:template match="ARQELEM" mode="indice">
    <li>
      <a href="http://localhost:7777/arqs/{position()}">
      <xsl:value-of select="IDENTI"/>
      </a>
    </li>
  </xsl:template>
  
  <!-- TEMPLATE PARA CONTEUDO ....................................................-->
  <xsl:template match="ARQELEM" mode="paginas">
    <xsl:result-document href="arqweb/arq{position()}.html">
      <html>
        <head>
          <title><xsl:value-of select="IDENTI"/></title>
        </head>
        <body>
          <h1><xsl:value-of select="IDENTI"/></h1>
          <xsl:if test="LUGAR">
            <p><b>Lugar: </b><xsl:value-of select="LUGAR"/></p>
          </xsl:if>
          <xsl:if test="FREGUE">
            <p><b>Freguesia: </b><xsl:value-of select="FREGUE"/></p>
          </xsl:if>
          <xsl:if test="CONCEL">
            <p><b>Concelho: </b><xsl:value-of select="CONCEL"/></p>
          </xsl:if>
          <xsl:if test="ACESSO">
            <p><b>Acesso: </b><xsl:value-of select="ACESSO"/></p>
          </xsl:if>
          <address>[<a href="http://localhost:7777/arqs/*">Voltar ao índice</a>]</address>
        </body>
      </html>
    </xsl:result-document>


  </xsl:template>

</xsl:stylesheet>
