'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  Save, 
  Plus, 
  X,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function UserProfile() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    institution: profile?.institution || '',
    role: profile?.role || '',
    research_interests: profile?.research_interests || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess(false);
  };

  const addResearchInterest = () => {
    if (newInterest.trim() && !formData.research_interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        research_interests: [...prev.research_interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const removeResearchInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      research_interests: prev.research_interests.filter(i => i !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {profile?.full_name ? getInitials(profile.full_name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="University or Organization"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Student, Researcher, Professor"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Research Interests */}
            <div className="space-y-2">
              <Label>Research Interests</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInterest(e.target.value)}
                    placeholder="Add a research interest"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addResearchInterest())}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addResearchInterest}
                    disabled={loading || !newInterest.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.research_interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.research_interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeResearchInterest(interest)}
                          className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
