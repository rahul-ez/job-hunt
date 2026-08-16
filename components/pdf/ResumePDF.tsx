import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export type ResumeContent = {
  fullName: string
  email: string
  phone?: string
  location?: string
  linkedinUrl?: string
  portfolioUrl?: string
  summary: string
  workExperience: Array<{
    company: string
    jobTitle: string
    startDate: string
    endDate: string
    bullets: string[]
  }>
  skills: string[]
  education: {
    degree: string
    field: string
    institution: string
    year: string
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#101828',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#7C5CFC',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7C5CFC',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#6A7282',
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#101828',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E7EAF3',
    paddingBottom: 2,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#364153',
    lineHeight: 1.4,
  },
  roleItem: {
    marginBottom: 10,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#101828',
  },
  companyName: {
    fontSize: 10,
    color: '#7C5CFC',
    fontWeight: 'bold',
  },
  roleDates: {
    fontSize: 9,
    color: '#6A7282',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9,
    color: '#7C5CFC',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#364153',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  skillTag: {
    fontSize: 8.5,
    backgroundColor: '#F3E8FF',
    color: '#7C5CFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  eduText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#101828',
  },
  eduSub: {
    fontSize: 9,
    color: '#6A7282',
    marginTop: 1,
  },
})

export function ResumePDF({ data }: { data: ResumeContent }) {
  return (
    <Document title={`${data.fullName || 'Candidate'} — Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || 'Candidate Resume'}</Text>
          <View style={styles.contactRow}>
            {data.email ? <Text style={styles.contactItem}>{data.email}</Text> : null}
            {data.phone ? <Text style={styles.contactItem}>{data.phone}</Text> : null}
            {data.location ? <Text style={styles.contactItem}>{data.location}</Text> : null}
            {data.linkedinUrl ? <Text style={styles.contactItem}>{data.linkedinUrl}</Text> : null}
            {data.portfolioUrl ? <Text style={styles.contactItem}>{data.portfolioUrl}</Text> : null}
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.workExperience.map((role, idx) => (
              <View key={idx} style={styles.roleItem}>
                <View style={styles.roleHeader}>
                  <Text>
                    <Text style={styles.roleTitle}>{role.jobTitle}</Text>
                    {role.company ? <Text style={styles.companyName}> — {role.company}</Text> : null}
                  </Text>
                  <Text style={styles.roleDates}>
                    {role.startDate} {role.endDate ? `- ${role.endDate}` : role.startDate ? '- Present' : ''}
                  </Text>
                </View>
                {role.bullets && role.bullets.length > 0 ? (
                  <View>
                    {role.bullets.map((b, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            <View style={styles.skillsRow}>
              {data.skills.map((skill, idx) => (
                <Text key={idx} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Education */}
        {data.education && (data.education.degree || data.education.field || data.education.institution) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.eduText}>
              {data.education.degree} {data.education.field ? `in ${data.education.field}` : ''}
            </Text>
            <Text style={styles.eduSub}>
              {data.education.institution} {data.education.year ? `(${data.education.year})` : ''}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
